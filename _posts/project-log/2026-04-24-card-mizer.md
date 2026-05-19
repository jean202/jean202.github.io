---
layout: post
title: "card-mizer: 헥사고날 아키텍처로 카드 추천 백엔드를 만든 이유"
subtitle: "도메인 규칙을 중심에 두고 구조를 설계하면 무엇이 달라지는가"
categories: project-log
tags: spring-boot hexagonal gradle-multimodule testcontainers postgresql
comments: true
---

## 왜 만들었나

실무에서 Spring Boot 프로젝트를 여러 개 경험했는데 대부분 Controller → Service → Repository로 내려가는 단순한 레이어드 구조였다. 도메인 로직이 Service에 쌓이면서 점점 비대해지고, 테스트하기 어려워지는 패턴을 반복했다.

헥사고날 아키텍처(포트와 어댑터 패턴)를 직접 적용해 보고 싶었다. 카드 추천은 도메인 규칙이 복잡하면서도 외부 의존성(DB, API)이 명확히 분리되어 실습하기 좋은 주제였다.

## 무엇을 만들었나

카드 실적과 혜택 정책을 기반으로 사용 패턴에 가장 적합한 결제 카드를 추천하는 백엔드다.

## 구조 선택

**헥사고날 아키텍처 + 멀티모듈**

```
card-mizer/
├── domain/           # 도메인 엔티티, 포트 인터페이스, 도메인 서비스
├── application/      # 유스케이스 (인바운드 포트 구현)
├── adapter-in-web/   # REST API (컨트롤러)
├── adapter-out-db/   # PostgreSQL 연동 (아웃바운드 포트 구현)
└── bootstrap/        # 스프링 부트 진입점, 의존성 조립
```

핵심은 `domain` 모듈이 어디에도 의존하지 않는다는 점이다. DB나 HTTP에 대한 지식이 없다. 도메인 규칙을 순수하게 테스트할 수 있게 된다.

**포트 인터페이스 예시**

```java
// domain 모듈 안에 있다 - DB를 모른다
public interface CardRepository {
    List<Card> findByUserId(Long userId);
    void save(Card card);
}

// adapter-out-db 모듈이 구현한다
@Repository
public class CardRepositoryAdapter implements CardRepository {

    private final CardJpaRepository jpaRepository;

    @Override
    public List<Card> findByUserId(Long userId) {
        return jpaRepository.findByUserId(userId)
                .stream()
                .map(CardMapper::toDomain)
                .toList();
    }
}
```

## 추천 로직

추천 로직은 도메인 서비스에 있다. DB나 외부 API를 직접 부르지 않고 포트를 통해서만 데이터를 받는다.

1. 사용자의 월 카드 실적을 조회한다
2. 보유 카드의 혜택 정책(업종별 할인율, 포인트 적립 조건)을 로드한다
3. 과거 결제 데이터에서 업종별 지출 패턴을 분석한다
4. 각 카드의 예상 혜택 금액을 계산해 순위를 매긴다

## 테스트

**Testcontainers로 실제 PostgreSQL에 붙어서 통합 테스트**

```java
@SpringBootTest
@Testcontainers
class CardRecommendationIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");

    @DynamicPropertySource
    static void overrideProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Test
    void 실적_충족한_카드_중_혜택_높은_순으로_추천된다() {
        // given: 실적 데이터, 카드 정책, 결제 이력 삽입
        // when: 추천 API 호출
        // then: 혜택 금액 높은 카드가 상위에 위치
    }
}
```

H2 인메모리 DB를 쓰지 않은 이유: PostgreSQL 전용 문법과 인덱스 동작을 검증하려면 실제 DB가 필요하다. H2가 통과시켜도 운영에서 터지는 케이스가 있다.

## 만들면서 배운 것

레이어드 구조 대비 코드가 많아진다. 모듈이 늘어나고 매핑 코드가 생긴다. 하지만 도메인 로직 테스트가 빠르고 의존성 방향이 명확해지는 장점이 크다.

작은 CRUD 서비스에는 과한 구조다. 추천 로직처럼 도메인 규칙이 복잡하고 외부 의존성이 자주 바뀔 수 있는 상황에서 선택할 만하다.

## 현재 상태 / 다음 단계

- 핵심 추천 로직과 통합 테스트 동작 확인
- 데모 UI 미완성
- 추천 근거를 설명하는 응답 포맷 개선 예정

[GitHub 저장소](https://github.com/jean202/card-mizer)
