---
layout: post
title: "discord-kakao-translator: Discord 영어 메시지를 카카오톡으로 받는 브리지"
subtitle: "일상적인 불편을 실제 동작하는 개인 도구로 닫은 경험"
categories: project-log
tags: nodejs openai-api discord kakaotalk automation
comments: true
---

## 왜 만들었나

게임 커뮤니티 Discord 서버에 있었는데 영어 공지가 많았다. 영어를 읽을 수는 있지만 채널을 매번 확인하는 게 번거로웠다. 중요한 공지만 한국어로 번역해서 카카오톡으로 받으면 어떨까 싶었다.

작고 단순한 필요였지만, 끝까지 만들어서 실제로 쓰는 경험을 하고 싶었다.

## 무엇을 만들었나

Discord 채널을 감지해서 영어 비중이 높은 메시지만 선별하고 한국어로 번역해 카카오톡으로 전달하는 개인용 브리지다.

```
Discord 채널 모니터링
    ↓
언어 감지 (영어 비중 판단)
    ↓
OpenAI API로 번역
    ↓
KakaoTalk API로 전송
    ↓
[상태 UI] 처리 이력, 오류 현황, 설정 변경
[메뉴바 트레이] 백그라운드 실행, 빠른 토글
```

## 구현 포인트

**영어 비중 판단**: 단순히 "영어 메시지"를 기준으로 하면 한영 혼용 메시지도 다 잡힌다. 유니코드 범위로 영어 문자 비율을 계산하고 임계값을 넘을 때만 번역한다.

```javascript
function isEnglishDominant(text, threshold = 0.5) {
  const englishChars = text.match(/[a-zA-Z]/g)?.length ?? 0;
  const totalChars = text.replace(/\s/g, '').length;
  return totalChars > 0 && (englishChars / totalChars) >= threshold;
}
```

**번역 프롬프트**: 단순 번역이 아니라 Discord 문화에 맞는 맥락을 유지하도록 프롬프트를 작성했다. 게임 용어, 슬랭, 이모지는 그대로 유지하고 문장만 한국어로 옮긴다.

**카카오톡 전송**: 카카오톡 공개 API는 나에게 메시지를 보내는 것만 지원한다. 개인용으로는 충분하다.

**상태 UI**: 어떤 메시지가 번역됐는지, 오류가 있었는지를 확인하기 위해 간단한 웹 UI를 붙였다. 메뉴바 트레이에서 브리지를 켜고 끌 수 있다.

## 실패했던 것들

**카카오톡 그룹 채팅 전송**: 개인 메시지만 가능하다는 걸 나중에 알았다. 공식 API가 제한적이라 원하는 기능을 다 구현하지 못했다.

**특정 채널만 모니터링**: Discord 봇 권한 설정이 생각보다 복잡했다. 권한 없는 채널에 들어가려 하면 오류가 나는데 이 예외 처리를 꼼꼼하게 해야 했다.

## 만들면서 느낀 것

규모가 작은 도구일수록 "실제로 쓰이는가"가 중요하다. 이 브리지는 실제로 몇 달 동안 쓰면서 Discord 영어 공지를 빠뜨리지 않게 됐다. 기능이 많지 않아도 문제를 해결하면 그걸로 충분하다.

코드보다 설치 경험이 더 중요했다. 나 혼자 쓰는 도구라 온보딩에 신경 안 썼는데, 맥북을 바꾸고 다시 설치할 때 어려웠다. README가 자기 자신을 위한 문서라는 걸 실감했다.

## 현재 상태 / 다음 단계

- 핵심 번역 브리지와 상태 UI, 메뉴바 트레이 동작 확인
- 실제로 몇 달째 사용 중
- 설치 온보딩 개선 예정

[GitHub 저장소](https://github.com/jean202/discord-kakao-translator)
