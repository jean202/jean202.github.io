---
layout: post
title: "WebFlux + R2DBC로 NFT 마켓플레이스 API를 만든 경험"
subtitle: "비동기 논블로킹 스택의 실전 적용과 JPA와의 차이"
categories: tech
tags: spring-boot webflux r2dbc reactive
comments: true
---

파라메타에서 ISKRA NFT 마켓플레이스를 개발할 때 처음으로 WebFlux + R2DBC 스택을 실무에 적용했다. JPA에 익숙한 상태에서 리액티브 스택으로 전환하면서 겪은 것들을 정리한다.

## 왜 WebFlux를 선택했나

마켓플레이스 특성상 다수의 게임사 NFT를 동시에 탐색하고 조회하는 요청이 많았다. 블록체인 네트워크(Klaytn)에 상태를 조회하는 외부 I/O도 있었다.

MVC 스택에서 이런 패턴은 스레드가 I/O를 기다리는 동안 블로킹된다. 트래픽이 늘어나면 스레드 풀이 소진될 수 있다. WebFlux는 이벤트 루프 기반으로 스레드를 블로킹하지 않고 I/O 완료를 기다린다.

## R2DBC vs JPA

R2DBC는 관계형 DB를 비동기로 다루는 드라이버 스펙이다. JPA와 비교하면 차이가 명확하다.

| 항목 | JPA | R2DBC |
|------|-----|-------|
| 동작 방식 | 블로킹 | 논블로킹 |
| ORM 기능 | 풍부 (연관관계, 영속성 컨텍스트) | 없음 (Row 매핑 수준) |
| Lazy Loading | 가능 | 불가 |
| 복잡한 쿼리 | JPQL, Criteria API | 네이티브 SQL 위주 |
| 러닝 커브 | 중간 | 높음 (리액티브 패러다임 이해 필요) |

JPA의 편의 기능이 없으니 모든 연관 데이터를 직접 join 쿼리로 가져와야 한다. 처음에는 불편했지만 쿼리를 명시적으로 작성하게 되니 N+1이 구조적으로 발생하지 않는다는 장점도 있다.

## 기본 코드 구조

```java
// Repository
public interface NftRepository extends ReactiveCrudRepository<Nft, Long> {

    @Query("SELECT * FROM nft WHERE game_id = :gameId ORDER BY created_at DESC LIMIT :limit OFFSET :offset")
    Flux<Nft> findByGameId(Long gameId, int limit, int offset);
}

// Service
@Service
@RequiredArgsConstructor
public class NftService {

    private final NftRepository nftRepository;
    private final GameRepository gameRepository;

    public Mono<NftListResponse> getNftsByGame(Long gameId, int page, int size) {
        int offset = page * size;

        return gameRepository.findById(gameId)
                .switchIfEmpty(Mono.error(new GameNotFoundException(gameId)))
                .flatMap(game ->
                    nftRepository.findByGameId(gameId, size, offset)
                            .collectList()
                            .map(nfts -> NftListResponse.of(game, nfts, page, size))
                );
    }
}

// Controller
@RestController
@RequestMapping("/api/v1/nfts")
@RequiredArgsConstructor
public class NftController {

    private final NftService nftService;

    @GetMapping("/games/{gameId}")
    public Mono<ResponseEntity<NftListResponse>> getNftsByGame(
            @PathVariable Long gameId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return nftService.getNftsByGame(gameId, page, size)
                .map(ResponseEntity::ok);
    }
}
```

## 블록체인 연동 처리

Web3j는 기본적으로 블로킹 방식으로 동작한다. WebFlux 컨텍스트에서 사용하려면 `Mono.fromCallable`로 감싸고 별도 스케줄러로 실행해야 한다.

```java
@Service
@RequiredArgsConstructor
public class BlockchainService {

    private final Web3j web3j;

    public Mono<BigInteger> getNftBalance(String walletAddress, String contractAddress) {
        return Mono.fromCallable(() -> {
            KIP17 contract = KIP17.load(contractAddress, web3j, credentials, gasProvider);
            return contract.balanceOf(walletAddress).send();
        }).subscribeOn(Schedulers.boundedElastic()); // 블로킹 작업은 별도 스레드풀로
    }
}
```

`Schedulers.boundedElastic()`은 블로킹 I/O를 격리하는 용도다. 이벤트 루프 스레드를 블로킹하면 전체 성능이 떨어지므로 반드시 분리해야 한다.

## 겪었던 문제들

**에러 전파 방식이 다르다**

MVC에서는 `@ExceptionHandler`로 예외를 잡는다. WebFlux에서는 `Mono.error()`를 반환하고 `onErrorResume`, `onErrorMap`으로 처리하거나 `@ControllerAdvice`를 사용한다.

**테스트 작성이 어렵다**

`StepVerifier`를 써야 한다. 처음에는 낯설지만 익숙해지면 비동기 흐름을 검증하기 좋다.

```java
@Test
void getNftsByGame_returnsNftList() {
    // given
    when(nftRepository.findByGameId(1L, 20, 0)).thenReturn(Flux.just(nft1, nft2));
    when(gameRepository.findById(1L)).thenReturn(Mono.just(game));

    // when & then
    StepVerifier.create(nftService.getNftsByGame(1L, 0, 20))
            .assertNext(response -> {
                assertThat(response.getNfts()).hasSize(2);
            })
            .verifyComplete();
}
```

## 돌아보며

WebFlux + R2DBC는 I/O 집약적인 서비스에서 확실히 효과가 있다. 다만 JPA에서 무료로 얻던 것들(연관관계, 영속성 컨텍스트, 트랜잭션 편의)이 사라지므로 팀 전체의 리액티브 이해도가 받쳐줘야 한다.

모든 서비스에 WebFlux가 맞는 것은 아니다. 단순한 CRUD 중심 서비스라면 MVC + JPA 조합이 개발 생산성 면에서 훨씬 낫다. 동시 I/O가 많고 외부 시스템 연동이 많은 서비스에서 선택을 고려하면 된다.
