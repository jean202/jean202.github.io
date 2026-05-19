---
layout: page
title: Portfolio
description: 주요 프로젝트와 개발 경험을 한눈에 볼 수 있도록 정리한 포트폴리오입니다.
permalink: /portfolio/
redirect_from:
  - /portfolio.html
menu: false
order: 1
---

<section class="profile-section profile-section--intro">
  <div class="profile-hero">
    <p class="profile-kicker">Java Backend Engineer</p>
    <h2 class="profile-heading">김진하</h2>
    <p class="profile-summary">Java와 Spring 기반 백엔드 개발을 중심으로 일해 왔습니다. 인증, 권한, 데이터 처리, API 설계처럼 서비스 안쪽에서 돌아가는 로직을 다루는 일이 많았습니다. 최근에는 백엔드를 기반으로 AI 기능, 분석 화면, 운영 도구처럼 실제 사용자가 만나는 부분까지 조금씩 넓혀 보고 있습니다. 이 페이지에는 그동안 만든 프로젝트와 경력을 함께 정리했습니다.</p>
    <div class="profile-actions">
      <a class="profile-button" href="mailto:anowheretogo@naver.com">Email</a>
      <a class="profile-button profile-button--ghost" href="https://github.com/jean202">GitHub</a>
    </div>
  </div>
</section>

<section class="profile-section">
  <h2>추구하는 방향</h2>
  <div class="profile-grid profile-grid--three">
    <article class="profile-card profile-card--accent">
      <h3>백엔드 설계</h3>
      <p>Spring Boot, WebFlux, Kafka, SDK 설계, 헥사고날 아키텍처, 멀티모듈처럼 서비스가 오래 유지되기 위한 구조를 고민해 왔습니다.</p>
    </article>
    <article class="profile-card">
      <h3>문서 정리</h3>
      <p>API 명세, 화면 스펙, 기술 결정 문서, README를 함께 남겨서 나중에 다시 봐도 왜 그렇게 만들었는지 알 수 있게 하려 합니다.</p>
    </article>
    <article class="profile-card">
      <h3>제품 기능 구현</h3>
      <p>백엔드가 중심이지만 AI 기능, 분석 화면, 랜딩 페이지, 운영 도구, 자동화 파이프라인처럼 사용자가 실제로 만나는 부분도 함께 만들어 봅니다.</p>
    </article>
  </div>
</section>

<section class="profile-section">
  <h2>프로젝트 선택 기준</h2>
  <div class="profile-grid profile-grid--three">
    <article class="profile-card profile-card--accent">
      <h3>백엔드 기본기</h3>
      <p><strong>card-mizer</strong>, <strong>asset-radar</strong>, <strong>slotops</strong>는 도메인 모델링, 이벤트 처리, 운영 API, 예약/리소스 관리처럼 백엔드에서 자주 부딪히는 문제를 다룬 프로젝트입니다.</p>
    </article>
    <article class="profile-card">
      <h3>현장에서 본 문제</h3>
      <p><strong>booking-reservation-sync-monitor</strong>는 호텔 근무 중 봤던 OTA/PMS 동기화 지연을 백엔드 시스템으로 풀어 본 프로젝트입니다. 예약 누락이나 배정 지연처럼 운영에서 바로 문제가 되는 상황을 줄이는 데 초점을 맞췄습니다.</p>
    </article>
    <article class="profile-card">
      <h3>AI를 붙여 본 제품</h3>
      <p><strong>ThreadKeeper</strong>와 <strong>SignalMate</strong>는 AI 호출 자체보다 사용자가 판단하거나 다음 행동을 정하는 과정에 AI를 어떻게 넣을 수 있을지 실험한 프로젝트입니다.</p>
    </article>
  </div>
</section>

<section class="profile-section">
  <h2>대표 프로젝트 6개</h2>
  <div class="profile-grid profile-grid--two">
    <article class="profile-card profile-card--accent">
      <p class="profile-kicker">Backend / Data / Infra</p>
      <h3><a href="https://github.com/jean202/asset-radar">asset-radar</a></h3>
      <p>금, 코인, 국내외 주식 시세를 Upbit, Binance, KIS, Alpha Vantage, Finnhub, Gold API 6개 소스에서 수집하고 Kafka 기반 이벤트 흐름으로 분석, 알림, 조회 API와 React 대시보드까지 연결하는 실시간 자산 모니터링 프로젝트입니다.</p>
      <div class="profile-chip-group">
        <span class="profile-chip">Java</span>
        <span class="profile-chip">WebFlux</span>
        <span class="profile-chip">Kafka</span>
        <span class="profile-chip">Binance / Finnhub</span>
        <span class="profile-chip">React</span>
        <span class="profile-chip">Prometheus</span>
      </div>
    </article>
    <article class="profile-card">
      <p class="profile-kicker">Backend / Domain Modeling</p>
      <h3><a href="https://github.com/jean202/card-mizer">card-mizer</a></h3>
      <p>카드 실적과 혜택 정책을 바탕으로 결제 카드를 추천하는 백엔드입니다. 도메인 규칙을 중심에 두고 헥사고날 아키텍처와 멀티모듈 구조를 적용했으며, Testcontainers 기반 PostgreSQL 통합 테스트를 갖추고 있습니다.</p>
      <div class="profile-chip-group">
        <span class="profile-chip">Spring Boot</span>
        <span class="profile-chip">Hexagonal</span>
        <span class="profile-chip">Gradle Multi-module</span>
        <span class="profile-chip">Testcontainers</span>
        <span class="profile-chip">Flyway</span>
      </div>
    </article>
    <article class="profile-card">
      <p class="profile-kicker">Backend / Reservation Operations</p>
      <h3><a href="https://github.com/jean202/slotops">slotops</a></h3>
      <p>스터디룸, 연습실, 촬영 스튜디오, 스포츠 코트처럼 시간 단위로 자원을 예약하는 오프라인 사업장을 위한 예약 운영 SaaS 백엔드입니다. 조직, 지점, 자원, 예약 가능 규칙, 블랙아웃 기간, 예약 생성 흐름을 Spring Boot 기반으로 구현했습니다.</p>
      <div class="profile-chip-group">
        <span class="profile-chip">Spring Boot</span>
        <span class="profile-chip">JPA</span>
        <span class="profile-chip">JWT</span>
        <span class="profile-chip">Flyway</span>
        <span class="profile-chip">Reservation Rules</span>
      </div>
    </article>
    <article class="profile-card">
      <p class="profile-kicker">Backend / Hotel Operations</p>
      <h3><a href="https://github.com/jean202/booking-reservation-sync-monitor">booking-reservation-sync-monitor</a></h3>
      <p>호텔 근무 중 관찰한 Booking.com 예약 메일과 PMS 반영 지연 문제를 바탕으로 만든 Spring Boot 백엔드입니다. mock OTA connector, 멱등 import, PMS sync delay 감지, 객실 배정 추천, 운영 대시보드 API를 갖추고 있습니다.</p>
      <div class="profile-chip-group">
        <span class="profile-chip">Java 17</span>
        <span class="profile-chip">Spring Boot</span>
        <span class="profile-chip">JPA</span>
        <span class="profile-chip">OpenAPI</span>
        <span class="profile-chip">H2</span>
      </div>
    </article>
    <article class="profile-card">
      <p class="profile-kicker">AI Workflow / Handoff Tool</p>
      <h3><a href="https://github.com/jean202/threadkeeper">ThreadKeeper</a></h3>
      <p>여러 AI 작업 세션의 원래 의도, 완료 상태, 다음 액션, 인수인계 초안, 알림 규칙을 관리하는 작업 메모리 도구입니다. Spring Boot API, Next.js 대시보드, agent-state-migrator bridge를 함께 구성했습니다.</p>
      <div class="profile-chip-group">
        <span class="profile-chip">Spring Boot</span>
        <span class="profile-chip">Next.js</span>
        <span class="profile-chip">AI Workflow</span>
        <span class="profile-chip">Handoff</span>
        <span class="profile-chip">Discord Webhook</span>
      </div>
    </article>
    <article class="profile-card">
      <p class="profile-kicker">AI Product / UX / Positioning</p>
      <h3><a href="https://github.com/jean202/signalmate">SignalMate</a></h3>
      <p>채팅 기반 관계 신호를 분석하고 다음 메시지까지 제안하는 AI 제품입니다. 카카오톡 내보내기 자동 파싱, 규칙 기반+LLM 하이브리드 분석 엔진, 4단계 분석 체험 UI를 갖추고 있습니다.</p>
      <div class="profile-chip-group">
        <span class="profile-chip">Next.js</span>
        <span class="profile-chip">Prisma</span>
        <span class="profile-chip">Claude API</span>
        <span class="profile-chip">Chat Parser</span>
        <span class="profile-chip">Rule-based + AI</span>
      </div>
    </article>
  </div>
</section>

<section class="profile-section">
  <h2>라이브러리 / 자동화 도구</h2>
  <div class="profile-grid profile-grid--two">
    <article class="profile-card">
      <p class="profile-kicker">Java SDK / Notification</p>
      <h3><a href="https://github.com/jean202/webhook-notify">webhook-notify</a></h3>
      <p>Spring 애플리케이션과 순수 Java 애플리케이션에서 Slack/Discord 웹훅 알림을 다루기 위한 경량 SDK입니다. 템플릿 렌더링, 조건부 전송, Spring AOP 어노테이션 연동까지 확장했습니다.</p>
      <div class="profile-chip-group">
        <span class="profile-chip">Java 17</span>
        <span class="profile-chip">Gradle Multi-module</span>
        <span class="profile-chip">Spring AOP</span>
        <span class="profile-chip">Slack / Discord</span>
      </div>
    </article>
    <article class="profile-card">
      <p class="profile-kicker">AI Automation / Marketing</p>
      <h3><a href="https://github.com/jean202/blog-to-shorts">blog-to-shorts</a></h3>
      <p>네이버 블로그 글을 크롤링해 AI로 스크립트를 만들고, 세로형 영상 생성과 YouTube Shorts 업로드까지 자동화하는 파이프라인입니다.</p>
      <div class="profile-chip-group">
        <span class="profile-chip">Python</span>
        <span class="profile-chip">FastAPI</span>
        <span class="profile-chip">Claude API</span>
        <span class="profile-chip">FFmpeg</span>
      </div>
    </article>
    <article class="profile-card">
      <p class="profile-kicker">User Problem / Integration Tool</p>
      <h3><a href="https://github.com/jean202/discord-kakao-translator">discord-kakao-translator</a></h3>
      <p>Discord 메시지를 감지해 영어 비중이 높은 메시지만 한국어로 번역하고 카카오톡으로 전달하는 개인용 브리지입니다. 상태 UI와 메뉴바 트레이 앱까지 함께 다루고 있습니다.</p>
      <div class="profile-chip-group">
        <span class="profile-chip">Node.js</span>
        <span class="profile-chip">OpenAI API</span>
        <span class="profile-chip">Discord</span>
        <span class="profile-chip">KakaoTalk</span>
      </div>
    </article>
    <article class="profile-card">
      <p class="profile-kicker">Local AI Tool / Python CLI</p>
      <h3><a href="https://github.com/jean202/video-trans">video-trans</a></h3>
      <p>비디오에서 자막과 텍스트를 로컬에서만 추출하는 CLI 도구입니다. faster-whisper로 음성을 SRT/VTT/TXT로 변환하고, Tesseract OCR로 화면 문자열도 추출합니다. 외부 API 없이 완전 오프라인으로 동작하며, 여러 파일 배치 처리와 SNS 숏폼 영역 크롭 OCR을 지원합니다.</p>
      <div class="profile-chip-group">
        <span class="profile-chip">Python</span>
        <span class="profile-chip">faster-whisper</span>
        <span class="profile-chip">Tesseract OCR</span>
        <span class="profile-chip">ffmpeg</span>
        <span class="profile-chip">SRT / VTT</span>
        <span class="profile-chip">Offline / Local</span>
      </div>
    </article>
    <article class="profile-card">
      <p class="profile-kicker">Local Utility / Java CLI</p>
      <h3><a href="https://github.com/jean202/heic-jpg">heic-jpg</a></h3>
      <p>macOS에서 HEIC/HEIF 파일을 JPEG로 일괄 변환하는 Java 17 CLI입니다. 단일 파일, 디렉터리 재귀 변환, dry-run, overwrite, max-dimension 옵션을 지원합니다.</p>
      <div class="profile-chip-group">
        <span class="profile-chip">Java 17</span>
        <span class="profile-chip">CLI</span>
        <span class="profile-chip">macOS sips</span>
        <span class="profile-chip">Batch Conversion</span>
      </div>
    </article>
  </div>
</section>

<section class="profile-section">
  <h2>협업 / 앱 프로젝트</h2>
  <div class="profile-grid profile-grid--two">
    <article class="profile-card">
      <p class="profile-kicker">Flutter App / Collaborative Editor</p>
      <h3><a href="https://github.com/ZayaMK/Cleanera">Cleanera</a></h3>
      <p>청소 시설의 평면도와 구역, 오브젝트를 편집하고 팀 단위로 동기화하는 Flutter 기반 에디터 프로젝트입니다. headless editor engine, snapshot+delta undo/redo, offline-first 저장, Supabase Realtime 동기화 구조를 다룹니다.</p>
      <div class="profile-chip-group">
        <span class="profile-chip">Flutter</span>
        <span class="profile-chip">Dart</span>
        <span class="profile-chip">Riverpod</span>
        <span class="profile-chip">Drift</span>
        <span class="profile-chip">Supabase Realtime</span>
      </div>
    </article>
  </div>
</section>

<section class="profile-section">
  <h2>경력</h2>
  <div class="profile-timeline">
    <article class="timeline-item">
      <p class="timeline-item__period">Career</p>
      <h3>TixPass</h3>
      <p class="timeline-item__subtitle">티켓 플랫폼 백엔드 개발</p>
      <p>예매와 이용권 같은 티켓 플랫폼의 핵심 흐름을 다루는 백엔드 기능을 개발했고, API 설계와 데이터 모델링, 운영 관점의 개선을 함께 진행했습니다.</p>
    </article>
    <article class="timeline-item">
      <p class="timeline-item__period">Career</p>
      <h3>파라메타 (PARAMETA)</h3>
      <p class="timeline-item__subtitle">Web3 및 블록체인 기반 서비스 백엔드 개발</p>
      <p>블록체인 기반 신원 인증 출입 관리 시스템과 NFT 마켓플레이스 API를 개발했습니다. Spring Boot, MyBatis, jOOQ, R2DBC, WebMvc, WebFlux, Solidity를 실무에 적용했습니다.</p>
    </article>
    <article class="timeline-item">
      <p class="timeline-item__period">Career</p>
      <h3>(주) 반디에스앤씨</h3>
      <p class="timeline-item__subtitle">SSO, IM/EAM 솔루션 개발</p>
      <p>Spring Boot, JPA, GraphQL 기반의 백엔드 기능을 개발했고, Apollo, Axios, Vue.js를 사용해 기능 단위의 프론트엔드 작업도 함께 수행했습니다.</p>
    </article>
  </div>
</section>

<section class="profile-section">
  <h2>학력과 문서화 방식</h2>
  <div class="profile-grid profile-grid--two">
    <article class="profile-card">
      <h3>Education</h3>
      <div class="profile-list">
        <div class="profile-list__item">
          <strong>한국방송통신대학교</strong>
          <span>컴퓨터과학과 졸업 · 2016.03 - 2020.08</span>
        </div>
        <div class="profile-list__item">
          <strong>명지대학교</strong>
          <span>행정학과 · 2010.03 - 2011.02</span>
        </div>
      </div>
    </article>
    <article class="profile-card">
      <h3>Documentation-first</h3>
      <div class="profile-chip-group">
        <span class="profile-chip">API Spec</span>
        <span class="profile-chip">Screen Spec</span>
        <span class="profile-chip">ADR</span>
        <span class="profile-chip">README</span>
        <span class="profile-chip">Tech Decision Log</span>
      </div>
      <p>구현만 남기지 않고, 왜 이 구조를 택했고 어디까지 만들었는지를 문서로 남기는 습관을 중요하게 봅니다. 포트폴리오에서도 이 기록 방식을 하나의 강점으로 드러내고자 합니다.</p>
    </article>
  </div>
</section>

<section class="profile-section">
  <h2>기술과 자격</h2>
  <div class="profile-grid profile-grid--two">
    <article class="profile-card">
      <h3>Tech Stack</h3>
      <div class="profile-chip-group">
        <span class="profile-chip">Java</span>
        <span class="profile-chip">Spring Boot</span>
        <span class="profile-chip">WebFlux</span>
        <span class="profile-chip">Kafka</span>
        <span class="profile-chip">Hexagonal</span>
        <span class="profile-chip">JPA</span>
        <span class="profile-chip">Flyway</span>
        <span class="profile-chip">PostgreSQL</span>
        <span class="profile-chip">Docker</span>
        <span class="profile-chip">Prometheus</span>
        <span class="profile-chip">Next.js</span>
        <span class="profile-chip">React</span>
        <span class="profile-chip">TypeScript</span>
        <span class="profile-chip">Flutter</span>
        <span class="profile-chip">Python</span>
        <span class="profile-chip">OpenAI API</span>
        <span class="profile-chip">Claude API</span>
        <span class="profile-chip">FFmpeg</span>
      </div>
    </article>
    <article class="profile-card">
      <h3>Etc.</h3>
      <div class="profile-list">
        <div class="profile-list__item">
          <strong>정보처리기사</strong>
          <span>Certification</span>
        </div>
        <div class="profile-list__item">
          <strong>컴퓨터활용능력 2급</strong>
          <span>Certification</span>
        </div>
        <div class="profile-list__item">
          <strong>워드 1급</strong>
          <span>Certification</span>
        </div>
        <div class="profile-list__item">
          <strong>OPIC IM2</strong>
          <span>Language</span>
        </div>
      </div>
    </article>
  </div>
</section>
