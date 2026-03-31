# Project Technical Overview

## Summary

이 프로젝트는 Hydejack 테마를 기반으로 한 Jekyll 정적 블로그/포트폴리오 사이트다.  
콘텐츠는 Markdown과 YAML 데이터 파일로 관리하고, 최종 페이지는 Jekyll과 Liquid 템플릿으로 렌더링한다.

## Main Technologies

- Static site generator: Jekyll 3.9.x
- Theme base: Hydejack 6.4.0
- Template system: Liquid
- Styling: Sass
- Content format: Markdown
- Data files: YAML, JSON
- Ruby tooling: Bundler
- JavaScript bundler: esbuild
- Frontend libraries:
  - RxJS 5
  - KaTeX
  - y-drawer
  - y-push-state
  - web-animations-js
  - Modernizr

## Directory Structure

- `_layouts/`
  - 공통 페이지 레이아웃
- `_includes/`
  - 재사용 조각 템플릿
- `_posts/`
  - 블로그 글
- `_data/`
  - 작성자, 소셜 링크 등 구조화 데이터
- `_featured_categories/`
  - 카테고리 컬렉션 정의
- `_featured_tags/`
  - 태그 컬렉션 정의
- `_js/src/`
  - 프론트엔드 동작 코드
- `assets/`
  - 정적 자산과 생성된 CSS/JS
- `scripts/`
  - 로컬 실행/빌드용 스크립트

## Rendering Approach

이 사이트는 전형적인 콘텐츠 중심 정적 사이트 구조를 따른다.

- `index.html`은 `blog` 레이아웃을 사용한다.
- `_layouts/base.html`이 공통 HTML 골격을 만든다.
- `_layouts/blog.html`이 포스트 목록을 렌더링한다.
- `_layouts/post.html`이 포스트 상세를 렌더링한다.
- `_layouts/list.html`과 `_layouts/tag-blog.html`이 카테고리/태그별 목록을 만든다.

즉, 페이지를 애플리케이션 상태로 직접 조합하는 방식이 아니라, 빌드 시점에 정적 HTML을 생성하고 필요한 인터랙션만 JavaScript로 덧붙이는 방식이다.

## Content Modeling

콘텐츠는 다음 방식으로 모델링되어 있다.

- 포스트: `_posts/` 아래 Markdown 파일
- 카테고리: `_featured_categories/` 컬렉션
- 태그: `_featured_tags/` 컬렉션
- 작성자 정보: `_data/authors.yml`
- 소셜 링크 메타데이터: `_data/social.yml`

이 구조 덕분에 사이드바 메뉴, 태그 링크, 카테고리 목록 같은 UI가 데이터 기반으로 구성된다.

## Frontend Implementation

JavaScript는 전체 사이트를 SPA로 만드는 용도가 아니라, 정적 사이트의 사용자 경험을 보강하는 용도다.

- `drawer.js`
  - 모바일/데스크톱 사이드바 드로어 제어
- `push-state.js`
  - 내부 링크 이동 시 일부 영역만 교체하는 push-state 기반 전환 처리
- `cross-fader.js`
  - 페이지 전환 시 사이드바 배경 이미지/색상 페이드 처리
- `flip/`
  - 제목 이동 애니메이션
- `katex.js`
  - 수학 수식을 KaTeX로 업그레이드

구현 방식은 Progressive Enhancement에 가깝다.  
기본 콘텐츠는 정적 HTML로 제공되고, 브라우저 기능이 충분할 때만 애니메이션/전환 기능이 활성화된다.

## Build and Run

### Ruby side

- Jekyll 빌드와 로컬 서버 실행 담당
- 로컬 실행 래퍼:
  - `./scripts/jekyll-local.sh build`
  - `./scripts/jekyll-local.sh serve --host 127.0.0.1 --port 4000`

### JavaScript side

- esbuild로 `_js/src/index.js`를 번들링
- 출력 파일:
  - `assets/js/hydejack.js`
- 번들 target:
  - `es2015`

명령:

- `npm run build:js`
- `npm run watch:js`
- `npm run lint:js`
- `npm run verify:js`

## Notable Customizations

- Hydejack 기본 테마 위에 개인 정보와 메뉴 구조를 커스터마이즈했다.
- 광고 코드, 공유 링크, 사이드바 메뉴 로직이 템플릿에 포함돼 있다.
- `_plugins/youtube.rb`로 YouTube embed 태그를 커스텀 지원한다.

## Operational Notes

- 이 저장소는 정적 자산 일부를 커밋해 둔 구조다.
- Jekyll 로컬 실행에는 Node.js가 필수는 아니다.
- JavaScript 빌드 체인은 Browserify/Babel 6에서 esbuild로 교체되었다.
- esbuild 특성상 현재 번들은 `es5`가 아니라 `es2015`를 목표로 한다.
- `docs/`는 사이트 콘텐츠가 아니라 저장소 문서로 취급한다.
