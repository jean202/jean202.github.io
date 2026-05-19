---
layout: post
title: "asset-radar: 실시간 자산 모니터링 파이프라인을 만든 이유와 구조"
subtitle: "6개 시세 소스 → Kafka → 분석/알림/대시보드까지"
categories: project-log
tags: java webflux kafka react prometheus
comments: true
---

## 왜 만들었나

금, 코인, 국내외 주식을 여러 앱에 분산해서 보고 있었다. 각 앱이 보여주는 기준이 달라서 한눈에 비교하기 어려웠고, 특정 가격에 도달했을 때 알림을 받는 기능도 없었다.

직접 수집하고 분석하면 된다고 생각했다. 동시에 WebFlux와 Kafka를 실무 외에서도 써보고 싶었다.

## 무엇을 만들었나

6개 API 소스(Upbit, Binance, KIS, Alpha Vantage, Finnhub, Gold API)에서 시세를 수집해 Kafka로 흘리고, 분석·알림·조회 API와 React 대시보드까지 연결하는 파이프라인이다.

```
[시세 수집기] → Kafka Topic → [분석 컨슈머] → PostgreSQL
                                              → [알림 컨슈머] → 알림 발송
[조회 API] ← PostgreSQL
[React 대시보드] ← 조회 API
```

## 핵심 기술 선택

**WebFlux로 수집기를 만든 이유**: 6개 외부 API를 동시에 폴링할 때 블로킹 방식이면 스레드가 낭비된다. WebFlux + `Flux.interval`로 비동기 폴링을 구성했다.

```java
Flux.interval(Duration.ofSeconds(10))
    .flatMap(tick -> Flux.merge(
        upbitClient.fetchPrices(),
        binanceClient.fetchPrices(),
        kisClient.fetchPrices()
    ))
    .subscribe(price -> kafkaTemplate.send("price-raw", price));
```

**Kafka를 넣은 이유**: 수집과 분석을 분리하기 위해서다. 수집기가 터져도 이미 Kafka에 들어간 데이터는 안전하고, 분석 로직을 나중에 추가해도 수집기를 건드릴 필요가 없다.

**Prometheus + Grafana**: 수집 성공률, Kafka 지연, API 응답 시간을 대시보드로 보기 위해 붙였다. Micrometer로 커스텀 메트릭을 붙이는 게 생각보다 간단했다.

## 만들면서 어려웠던 것

**외부 API 스펙이 다 다르다**: 각 소스마다 인증 방식, 응답 구조, 레이트 리밋이 다 달랐다. 공통 인터페이스를 먼저 정의하고 소스마다 어댑터를 만드는 방식으로 해결했다.

**KIS API 인증**: 국내 증권사 API는 OAuth 토큰 방식인데 만료 처리를 직접 구현해야 했다. 토큰을 Redis에 캐싱하고 만료 직전에 갱신하는 로직을 붙였다.

## 현재 상태 / 다음 단계

- 수집·Kafka 파이프라인·기본 대시보드 동작 확인
- 알림 조건 설정 UI 미완성
- 대시보드 스크린샷과 아키텍처 다이어그램 추가 예정

[GitHub 저장소](https://github.com/jean202/asset-radar)
