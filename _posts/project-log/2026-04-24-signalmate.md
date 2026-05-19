---
layout: post
title: "SignalMate: AI로 관계 신호를 분석하는 제품을 만든 과정"
subtitle: "문제 정의부터 4단계 분석 UX, 규칙 기반+LLM 하이브리드 엔진까지"
categories: project-log
tags: nextjs claude-api prisma ai-product
comments: true
---

## 왜 만들었나

주변에서 연애 상담을 받는 상황을 자주 봤다. "이 메시지가 무슨 뜻이야?", "다음에 뭐라고 해야 해?" 같은 질문들이다. 카카오톡 대화를 직접 붙여넣고 분석받을 수 있다면 어떨까 싶었다.

기술적으로는 LLM을 단순 챗봇이 아니라 특정 도메인의 분석 엔진으로 쓰는 제품을 만들어 보고 싶었다.

## 무엇을 만들었나

카카오톡 대화를 업로드하면 관계 신호를 분석하고 다음 메시지를 제안하는 AI 제품이다.

사용 흐름:
1. 카카오톡 내보내기 파일(.txt) 업로드
2. 자동 파싱 및 대화 구조 시각화
3. 규칙 기반 + LLM 하이브리드 분석 실행
4. 신호 해석 결과와 다음 메시지 제안 수신

## 핵심 기술 결정

**카카오톡 파서를 직접 만들었다**

카카오톡 내보내기 포맷은 공식 스펙이 없다. 버전에 따라 날짜 형식과 구분자가 다르다. 정규식으로 포맷별 파싱 로직을 만들고 신뢰도 스코어를 붙여서 자동 감지하게 했다.

```typescript
const patterns = [
  { regex: /(\d{4}년 \d{1,2}월 \d{1,2}일)/, version: 'v1' },
  { regex: /(\d{4}\.\d{2}\.\d{2})/, version: 'v2' },
];

function detectFormat(raw: string): ParsedFormat {
  for (const pattern of patterns) {
    if (pattern.regex.test(raw)) {
      return parseByVersion(raw, pattern.version);
    }
  }
  throw new UnsupportedFormatError();
}
```

**규칙 기반 + LLM 하이브리드 분석**

LLM만으로 분석하면 결과가 매번 달라지고 근거를 설명하기 어렵다. 규칙 기반으로 먼저 신호를 추출하고, LLM은 해석과 제안 생성에만 쓴다.

```typescript
// 1단계: 규칙 기반으로 신호 추출
const signals = extractSignals(messages); // 응답 속도, 이모지 패턴, 대화 주도권 등

// 2단계: 추출된 신호를 컨텍스트로 넣어 LLM에 해석 요청
const analysis = await claude.messages.create({
  model: 'claude-opus-4-5',
  messages: [{
    role: 'user',
    content: buildPrompt(signals, recentMessages)
  }]
});
```

프롬프트에 신호 데이터를 구조화해서 넣으니 결과의 일관성이 높아졌다.

**"연애 예언"이 아니라 "근거 중심 해석"으로 포지셔닝**

초기 기획에서 "상대방의 마음을 알려드립니다"라는 방향을 고려했지만 버렸다. 대화 데이터로 상대방 감정을 단정할 수 없고, 그런 포지셔닝은 신뢰를 잃는다.

최종 포지셔닝: 관찰 가능한 신호(응답 패턴, 대화 구조, 단어 선택)를 분석하고, 가능한 해석과 다음 액션을 근거와 함께 제안한다.

## 제품 설계에서 어려웠던 것

**분석 결과를 어떻게 보여줄까**: 텍스트로만 나열하면 읽기 어렵다. 신호별 카드로 분리하고, 각 카드에 "관찰된 패턴 → 가능한 해석 → 불확실성 수준"을 담는 구조로 정리했다.

**개인정보 처리**: 카카오톡 대화는 민감한 개인정보다. 서버에 저장하지 않고 분석 후 즉시 폐기하는 방식으로 설계했다. 이 부분을 랜딩에서 명시적으로 설명한다.

## 현재 상태 / 다음 단계

- 파서, 분석 엔진, 4단계 UX 동작 확인
- 결제/전환 플로우 MVP 수준 설계 진행 중
- 분석 결과 예시 캡처와 사용자 피드백 수집 예정

[GitHub 저장소](https://github.com/jean202/signalmate)
