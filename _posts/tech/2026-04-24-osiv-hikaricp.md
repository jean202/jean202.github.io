---
layout: post
title: "OSIV 비활성화와 HikariCP 고갈 문제를 함께 해결한 이야기"
subtitle: "트랜잭션 경계를 명확히 하면 커넥션 풀 문제도 따라 풀린다"
categories: tech
tags: spring-boot jpa hikaricp osiv
comments: true
---

티켓팅 플랫폼을 운영하던 중 간헐적으로 `Connection is not available, request timed out after 30000ms` 오류가 발생했다. 원인을 추적하다 OSIV 설정과 HikariCP 커넥션 풀 설정이 맞물려 있다는 것을 발견했다.

## OSIV란 무엇인가

OSIV(Open Session In View)는 HTTP 요청이 시작되는 시점부터 응답이 끝날 때까지 영속성 컨텍스트(EntityManager)를 열어두는 Spring의 기본 동작이다.

```yaml
# application.yml 기본값
spring:
  jpa:
    open-in-view: true  # 기본이 true
```

이 설정이 켜져 있으면 Controller, Service, Repository를 넘나들며 지연 로딩(Lazy Loading)이 가능해진다. 편하게 느껴지지만 문제가 있다.

## 무엇이 문제였나

OSIV가 활성화된 상태에서 Spring은 트랜잭션이 끊기더라도 HTTP 요청이 끝날 때까지 DB 커넥션을 반납하지 않는다. Service 레이어 트랜잭션이 끝난 뒤에도 Controller에서 지연 로딩을 허용해야 하기 때문이다.

결과적으로 커넥션은 실제 DB 작업을 하지 않는 시간 동안에도 점유된 상태로 남는다. 트래픽이 늘어나면 풀의 커넥션이 소진되고 HikariCP가 타임아웃을 던진다.

```
# 로그에서 발견한 패턴
HikariPool-1 - Connection is not available, request timed out after 30000ms
```

## 해결 방향

### 1단계: OSIV 비활성화

```yaml
spring:
  jpa:
    open-in-view: false
```

이 한 줄로 영속성 컨텍스트가 트랜잭션 경계 내에서만 유효해진다. 트랜잭션이 끝나는 순간 커넥션이 즉시 반납된다.

### 2단계: 지연 로딩 오류 해결

OSIV를 끄면 `LazyInitializationException`이 곳곳에서 터진다. 트랜잭션 밖에서 지연 로딩을 쓰는 코드가 드러나기 때문이다. 이것 자체가 문제 코드를 찾는 계기가 된다.

해결 방법은 두 가지다.

**방법 A: 필요한 연관 엔티티를 조회 시 함께 가져온다**

```java
// before: Lazy 로딩에 의존
Ticket ticket = ticketRepository.findById(id).orElseThrow();
String venueName = ticket.getEvent().getVenue().getName(); // 트랜잭션 밖 → 오류

// after: fetch join으로 한 번에 조회
@Query("SELECT t FROM Ticket t JOIN FETCH t.event e JOIN FETCH e.venue WHERE t.id = :id")
Optional<Ticket> findWithEventAndVenue(@Param("id") Long id);
```

**방법 B: Service 레이어에서 DTO로 변환해 Controller에 전달**

```java
// Service 레이어 (트랜잭션 내)
@Transactional(readOnly = true)
public TicketDetailResponse getTicket(Long id) {
    Ticket ticket = ticketRepository.findWithEventAndVenue(id).orElseThrow();
    return TicketDetailResponse.from(ticket); // 트랜잭션 내에서 DTO 변환 완료
}

// Controller는 DTO만 받는다
public ResponseEntity<TicketDetailResponse> getTicket(@PathVariable Long id) {
    return ResponseEntity.ok(ticketService.getTicket(id));
}
```

### 3단계: HikariCP 설정 재검토

OSIV를 끄고 나면 커넥션 사용 패턴이 달라진다. 풀 사이즈도 재조정했다.

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 10       # 기본값 10, 트래픽에 맞게 조정
      minimum-idle: 5
      connection-timeout: 30000   # 30초
      idle-timeout: 600000        # 10분
      max-lifetime: 1800000       # 30분
```

HikariCP 공식 문서가 권장하는 풀 사이즈 공식은 `connections = (core_count * 2) + effective_spindle_count`다. 무작정 늘리는 것보다 실제 DB I/O 패턴을 보고 조정하는 것이 낫다.

## 결과

- 간헐적 커넥션 고갈 오류 해소
- 트랜잭션 경계가 명확해져 코드 가독성 향상
- LazyInitializationException 수정 과정에서 N+1 쿼리 5곳을 추가로 발견해 fetch join으로 교체

OSIV는 편의를 주는 대신 커넥션을 더 오래 쥐고 있는 트레이드오프를 가진다. 트래픽이 올라오는 서비스라면 비활성화하고 트랜잭션 경계를 명시적으로 관리하는 것이 낫다.
