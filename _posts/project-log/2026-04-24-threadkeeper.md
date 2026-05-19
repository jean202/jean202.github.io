---
layout: post
title: "ThreadKeeper: 여러 AI 작업 세션을 잊지 않기 위한 작업 메모리 도구"
subtitle: "세션 의도, 진행 상태, 인수인계, 알림을 한 곳에서 관리하기"
categories: project-log
tags: ai-workflow spring-boot nextjs handoff automation
comments: true
---

## 어떤 문제를 보았나

AI 툴을 쓰다 보면 자연스럽게 여러 세션에 작업을 분산하게 된다. 어떤 세션에서는 코드 리뷰를 맡기고, 다른 세션에서는 문서 초안을 만들고, 또 다른 창에서는 구현을 진행한다.

문제는 시간이 지나면 "내가 뭘 맡겼더라"를 잊는다는 점이다. 완료된 작업이 어느 탭에 있었는지, 다음에 무엇을 확인해야 하는지, 이전 세션의 의도가 무엇이었는지가 흐려진다.

ThreadKeeper는 이 문제를 "AI 작업 세션의 메모리와 인수인계를 관리하는 도구"로 풀어 보려는 프로젝트다.

## 무엇을 만들었나

ThreadKeeper는 여러 AI-assisted work 세션의 상태를 모으고, 다음 액션과 인수인계를 관리하는 제품형 도구다.

핵심 구성은 세 부분이다.

- **Spring Boot API**: thread, snapshot, handoff, provider connection, notification rule을 관리한다.
- **Next.js 대시보드**: 오늘 확인할 작업, thread 상세, handoff 작성 화면을 제공한다.
- **agent-state-migrator bridge**: 로컬 AI coding workspace 상태를 canonical source session으로 가져오는 연결 계층이다.

```
[local AI tool state]
        ↓
[agent-state-migrator bridge]
        ↓
[ThreadKeeper API] → threads / snapshots / handoffs / notifications
        ↓
[Next.js dashboard]
```

## 핵심 설계

**세션을 thread와 snapshot으로 분리했다**

thread는 사용자가 기억해야 할 작업 단위다. snapshot은 특정 시점의 상태 기록이다. 이렇게 나누면 하나의 작업이 여러 AI 도구와 여러 시점에 걸쳐 이어져도 흐름을 잃지 않는다.

**handoff를 별도 도메인으로 뒀다**

AI 작업에서 중요한 것은 "요약" 자체보다 "다음 사람이 바로 이어서 할 수 있는 상태"다. 그래서 handoff에는 완료된 것, 남은 것, 다음 액션, 주의할 점을 별도로 담도록 했다.

**알림은 규칙 기반으로 시작했다**

처음부터 복잡한 자동화를 넣기보다 inactivity reminder, completion notice, daily briefing 같은 규칙을 먼저 모델링했다. 실제로 잊지 않게 만드는 최소 단위가 알림이기 때문이다.

## 현재 상태 / 다음 단계

- Spring Boot API와 주요 도메인 테스트 구현
- Next.js 기본 대시보드와 thread 상세 화면 구현
- Discord webhook 기반 알림 dispatch 흐름 구현
- agent-state-migrator bridge PoC 구현
- 다음 단계는 실제 사용 흐름을 기준으로 import 품질, dashboard UX, handoff 생성 품질을 다듬는 것이다.

[GitHub 저장소](https://github.com/jean202/threadkeeper)
