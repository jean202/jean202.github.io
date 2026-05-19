---
layout: post
title: "booking-reservation-sync-monitor: 호텔 예약 동기화 지연을 백엔드로 감지하기"
subtitle: "OTA 예약 import, PMS 반영 지연, 객실 배정 추천, 운영 대시보드"
categories: project-log
tags: java spring-boot jpa hotel-tech dashboard
comments: true
---

## 왜 만들었나

주말에 호텔에서 일하면서 Booking.com, Agoda, Trip.com, Airbnb 같은 OTA 예약이 실제 운영에 어떤 영향을 주는지 볼 수 있었다. 특히 예약 메일은 먼저 도착했는데 PMS(Property Management System)에는 몇 분 뒤 반영되는 일이 있었다.

이 지연이 보이지 않으면 객실 준비가 늦어지거나, 중복 배정 위험을 놓칠 수 있다. 그래서 이 문제를 백엔드 시스템으로 모델링해 보기로 했다.

## 무엇을 만들었나

Booking.com retrieve/acknowledge 흐름에서 아이디어를 얻은 Spring Boot 백엔드 MVP다. 실제 Booking.com API를 호출하지 않고 mock connector만 사용한다.

핵심 기능은 다음과 같다.

- mock OTA reservation import
- `(channel, externalReservationId)` 기준 멱등 import
- PMS 반영 지연 시간 계산
- 체크인/체크아웃 기간과 객실 타입 기반 객실 후보 추천
- 중복 객실 배정 방지
- 운영 대시보드 API
- acknowledge simulation과 sync log 기록

## 핵심 설계

**외부 API를 connector 인터페이스 뒤로 숨겼다**

실제 OTA API 접근은 공식 파트너 권한이 필요하다. 그래서 service 계층이 mock 구현에 직접 의존하지 않도록 `BookingReservationConnector` 인터페이스를 먼저 만들었다. 나중에 실제 HTTP client로 바꾸더라도 import service의 핵심 규칙은 그대로 둔다.

**import를 멱등하게 만들었다**

예약 수집 작업은 여러 번 실행될 수 있다. 같은 예약이 중복 저장되면 운영 데이터가 망가지기 때문에 `(channel, externalReservationId)` 조합으로 중복을 막고, 이미 존재하는 예약은 필요한 상태만 갱신한다.

**객실 배정은 날짜 겹침을 기준으로 판단했다**

같은 객실은 `checkIn < existingCheckOut AND existingCheckIn < checkOut` 조건을 만족하면 겹친다. 이 조건을 기준으로 예약 후보에서 이미 점유된 객실을 제외한다.

## 현재 상태 / 다음 단계

- Java 17 + Spring Boot 3 백엔드 구현
- H2 demo DB와 MySQL 호환을 고려한 JPA mapping
- Swagger UI와 curl walkthrough 정리
- import, room assignment, dashboard service test 통과
- 다음 단계는 MySQL profile, authentication, frontend dashboard, concurrent import hardening이다.

[GitHub 저장소](https://github.com/jean202/booking-reservation-sync-monitor)
