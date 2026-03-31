# Card Service Project Handoff

## Purpose

이 문서는 현재 블로그/포트폴리오 개선 세션과 별도로, 다음 세션에서 진행할 Java 대표 프로젝트 기획을 이어가기 위한 핸드오프 문서다.

핵심 의도는 두 가지다.

- 이 블로그 저장소에서는 포트폴리오 개선 자체에 집중한다.
- 새 Java 프로젝트의 설계와 구현은 별도 세션, 가능하면 별도 저장소에서 진행한다.

## Background

현재 블로그는 Jekyll 3.9 + Hydejack 6.4 기반 포트폴리오/블로그 사이트다.  
기존 후보 프로젝트 중 `mbti-self-cdm`, `meetric`, `videoTrans`, `videre`는 기술적으로 의미가 있지만, 사용자가 스스로 느끼기에 "Java 개발자" 정체성을 대표하는 프로젝트로는 부족하다.

따라서 포트폴리오의 대표 프로젝트로 내세울 수 있는, Java/Spring 기반의 새로운 프로젝트를 하나 직접 만드는 방향을 잡았다.

## High-Level Decision

새 프로젝트는 다음 성격을 가져야 한다.

- Java/Spring 생태계의 강점이 드러난다.
- 헥사고날 아키텍처 + 멀티모듈 구조가 실제로 설득력 있게 쓰인다.
- 단순 CRUD가 아니라 도메인 규칙이 풍부하다.
- 사용자가 실제로 겪는 문제를 푸는 서비스라서 동기가 명확하다.
- 나중에 블로그 포스트와 포트폴리오 프로젝트 상세 페이지로 연결하기 좋다.

## Chosen Domain

도메인은 "카드 실적 관리 및 결제 카드 추천 서비스"다.

사용자 상황:

- 삼성카드
- 국민카드 신용
- 국민카드 체크
- 현대카드

사용자는 매달 카드별 실적을 채워야 하고, 카드 우선순위가 상황에 따라 바뀐다.

실제 불편:

- 지금 각 카드 실적이 어디까지 찼는지 한눈에 보기 어렵다.
- 특정 금액을 결제하려고 할 때 어느 카드로 결제하는 게 맞는지 계산이 번거롭다.
- 카드별 구간 실적과 우선순위가 함께 작동해서 수동 판단 비용이 높다.

즉, 이 프로젝트는 "이번 달 카드 사용 전략을 계산해 주는 서비스"다.

## Why This Domain Fits Hexagonal + Multi-Module

이 프로젝트는 헥사고날 아키텍처를 억지로 씌우는 형태가 아니라, 구조적 이유가 있다.

### 1. External integrations can grow naturally

초기에는 수동 입력 기반으로 시작할 수 있고, 이후 외부 연동을 붙일 수 있다.

- 수동 결제 내역 입력
- 카드사별 사용 내역 조회 연동
- 알림 전송
- 스케줄러 기반 월간 마감/초기화 처리

즉, Port/Adapter 구조가 실제로 교체 가능성을 가진다.

### 2. Domain rules are non-trivial

단순히 "사용 내역 저장"만 하는 서비스가 아니다.

- 카드별 실적 구간이 다르다.
- 우선순위가 동적으로 바뀐다.
- 특정 결제를 어느 카드에 태우는 게 더 유리한지 계산해야 한다.
- 어떤 카드는 1구간 달성이 우선이고, 어떤 카드는 이미 달성 완료일 수 있다.
- 실적 달성과 즉시 혜택이 충돌할 수 있다.

핵심 로직이 도메인 계층에 살아 있어야 한다.

### 3. Module boundaries are clear

멀티모듈 구성이 자연스럽다.

- `core`: 도메인 모델, 정책, 유스케이스, 포트
- `api`: REST 컨트롤러, DTO, 요청 검증
- `infra`: JPA, 외부 연동, 알림, 배치/스케줄러 구현
- `common`: 공통 예외, 유틸, 공통 타입

### 4. Multiple entry points are plausible

같은 유스케이스를 여러 진입점에서 호출할 수 있다.

- REST API
- 스케줄러
- 이벤트 소비자
- 추후 CLI나 어드민 배치

## Project Direction

프로젝트는 아래 역량을 보여주는 것이 목표다.

- Java/Spring 기반 설계 역량
- 헥사고날 아키텍처 이해와 적용
- 멀티모듈 Gradle 구성 능력
- 도메인 모델링
- 테스트 전략 분리
- 문서화 습관

## Working Scope for the Next Session

다음 세션에서는 구현에 너무 빨리 들어가기보다, 아래 순서로 기획과 뼈대를 확정하는 것이 좋다.

### Phase 1. Naming and framing

- 프로젝트 이름 확정
- 한 줄 소개 확정
- 포트폴리오에서 어떤 포지션으로 노출할지 정의

예시 포지션:

- "카드 실적과 혜택 우선순위를 계산해 결제 카드를 추천하는 Java 백엔드"

### Phase 2. Domain modeling

최소한 아래 개념은 잡아야 한다.

- Card
- CardPerformancePolicy
- SpendingRecord
- SpendingPeriod
- PriorityStrategy
- RecommendationContext
- RecommendationResult
- BenefitRule

### Phase 3. Architecture skeleton

아래와 같은 멀티모듈 구조를 검토한다.

```text
card-service/
├── card-common
├── card-core
├── card-api
├── card-infra
└── docs
```

원칙:

- `card-core`는 Spring/JPA 의존성을 가지지 않는다.
- `card-api`와 `card-infra`가 `card-core`를 의존한다.
- 외부 시스템 연동은 모두 Adapter로 둔다.

### Phase 4. Documentation-first setup

프로젝트 초기에 아래 문서를 같이 만든다.

- `docs/architecture.md`
- `docs/module-structure.md`
- `docs/adr/ADR-001-adopt-hexagonal-architecture.md`
- `docs/adr/ADR-002-adopt-multi-module-gradle.md`

그리고 GitHub Projects로 최소한 아래 칼럼을 운영한다.

- Backlog
- Ready
- In Progress
- Review
- Done

### Phase 5. MVP boundary

첫 버전은 과도하게 넓히지 않는다.

MVP 후보 기능:

- 카드 등록
- 카드별 실적 정책 등록
- 이번 달 사용 내역 수동 입력
- 현재 실적 현황 조회
- 특정 결제 금액에 대한 추천 카드 계산
- 우선순위 변경

후순위:

- 실제 카드사 API 연동
- 푸시/카카오 알림
- 자동 혜택 계산 고도화
- 프론트엔드

## Suggested Technical Stack

- Java 17 or 21
- Spring Boot 3.x
- Gradle multi-module
- Spring Web
- Spring Data JPA
- PostgreSQL
- QueryDSL or jOOQ only if justified
- Testcontainers
- REST Docs or springdoc-openapi
- Docker Compose

주의:

- 기술 시연이 목적이라도 라이브러리만 늘어놓는 방향은 피한다.
- 구조적 이유 없이 Kafka, Redis, WebFlux를 넣지 않는다.
- 이 프로젝트는 "고성능"보다는 "설계와 도메인 판단"이 중심이다.

## Relationship to the Blog

이 프로젝트는 블로그 개선 방향과 연결된다.

향후 블로그/포트폴리오에는 아래 식으로 반영할 수 있다.

- 메인 Featured Project로 노출
- 프로젝트 상세 페이지 작성
- 헥사고날 아키텍처 적용기 포스트 작성
- 카드 추천 로직 모델링 포스트 작성
- 멀티모듈 설계 의사결정 포스트 작성

하지만 현재 세션에서는 여기까지만 기록하고, 실제 프로젝트 구체화는 별도 세션으로 넘긴다.

## Constraints for the Next Session

- 현재 블로그 저장소에서 구현하지 않는다.
- 가능하면 새 저장소에서 시작한다.
- 너무 빠르게 코드부터 치지 말고, 먼저 도메인/모듈/문서 뼈대를 잡는다.
- 이름과 범위는 실사용성과 포트폴리오 설득력을 기준으로 결정한다.

## Copy Summary

다음 세션에서 가장 먼저 전달할 핵심만 요약하면 아래와 같다.

- 나는 Java 개발자 포트폴리오를 강화하기 위해 새 대표 프로젝트를 만들고 싶다.
- 도메인은 카드 실적 관리 및 결제 카드 추천 서비스다.
- 이 프로젝트는 헥사고날 아키텍처 + 멀티모듈 Gradle로 설계하고 싶다.
- 구현 전에 이름, 도메인 모델, 모듈 구조, ADR 문서, GitHub Projects 구조부터 잡고 싶다.
- 현재 블로그 저장소와는 분리해서 진행하고 싶다.
