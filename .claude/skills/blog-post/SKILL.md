---
name: blog-post
description: Jekyll 블로그에 새 포스트를 작성한다. Hydejack 테마 기반.
argument-hint: "[포스트 제목]"
disable-model-invocation: true
---

## 블로그 포스트 작성

제목: **$ARGUMENTS**

### 파일 생성
```
_posts/YYYY-MM-DD-제목-slug.md
```

### 프론트매터 템플릿
```yaml
---
layout: post
title: "포스트 제목"
date: YYYY-MM-DD HH:MM:SS +0900
categories: [카테고리]
tags: [태그1, 태그2]
---
```

### 로컬 미리보기
```bash
bundle exec jekyll serve
```

### 주의사항
- Hydejack 테마 마크다운 규칙 따르기
- 이미지는 `assets/img/` 하위에 저장
- esbuild로 JS 번들링 (es2015 타겟)
