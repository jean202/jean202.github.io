---
layout: post
title: "blog-to-shorts: 블로그 글에서 유튜브 쇼츠까지 자동화 파이프라인"
subtitle: "크롤링 → AI 스크립트 생성 → 영상 제작 → 업로드 전 과정 자동화"
categories: project-log
tags: python fastapi claude-api ffmpeg automation
comments: true
---

## 왜 만들었나

블로그에 글을 쓰는 사람들이 유튜브 쇼츠로 콘텐츠를 확장하고 싶어도 영상 편집에 들어가는 시간 때문에 포기하는 경우가 많다. 글이 이미 있다면 영상 제작 과정을 자동화할 수 있겠다 싶었다.

동시에 AI를 콘텐츠 자동화 도구로 어디까지 활용할 수 있는지도 실험하고 싶었다.

## 무엇을 만들었나

네이버 블로그 URL을 입력하면 글을 크롤링하고, AI로 쇼츠용 스크립트를 생성하고, 세로형 영상을 만들어 YouTube Shorts로 업로드하는 파이프라인이다.

```
블로그 URL 입력
    ↓
[크롤러] 본문 텍스트 추출 (Playwright)
    ↓
[스크립트 생성] Claude API → 60초 분량 쇼츠 스크립트
    ↓
[TTS] 스크립트 → 음성 파일
    ↓
[영상 합성] FFmpeg → 자막 + 배경 이미지 + 음성 → MP4 (9:16)
    ↓
[업로드] YouTube Data API → Shorts 업로드
```

## 핵심 구현

**스크립트 생성 프롬프트 설계**

단순히 "요약해줘"가 아니라 쇼츠 형식에 맞는 구조로 생성되도록 프롬프트를 설계했다.

```python
prompt = f"""
다음 블로그 글을 유튜브 쇼츠(60초) 스크립트로 변환해줘.

형식:
- 첫 3초: 시청자를 잡는 훅 (질문이나 충격적인 사실)
- 본론 50초: 핵심 내용 3~4개 포인트
- 마지막 7초: 행동 유도 (좋아요, 구독)

조건:
- 구어체 사용, 문어체 금지
- 한 문장 15단어 이내
- 전문 용어는 쉬운 말로 풀기

블로그 글:
{blog_content}
"""
```

**FFmpeg으로 세로형 영상 합성**

자막을 프레임별로 타이밍에 맞게 넣는 게 까다로웠다. 스크립트를 문장 단위로 분리하고 TTS 음성의 타임스탬프와 맞춰서 `drawtext` 필터로 합성했다.

```python
def create_video(script_segments, audio_path, background_path, output_path):
    filter_complex = []
    for i, seg in enumerate(script_segments):
        filter_complex.append(
            f"drawtext=text='{seg.text}':fontsize=40:fontcolor=white"
            f":x=(w-text_w)/2:y=(h-text_h)/2"
            f":enable='between(t,{seg.start},{seg.end})'"
        )
    
    subprocess.run([
        'ffmpeg', '-loop', '1', '-i', background_path,
        '-i', audio_path,
        '-vf', ','.join(filter_complex),
        '-c:v', 'libx264', '-c:a', 'aac',
        '-shortest', '-s', '1080x1920',  # 9:16 세로형
        output_path
    ])
```

**FastAPI로 비동기 작업 관리**

영상 생성은 오래 걸리는 작업이라 동기 API로 처리하면 타임아웃이 난다. FastAPI + Celery로 작업을 큐에 넣고 상태를 조회하는 방식으로 구현했다.

```python
@app.post("/pipeline/start")
async def start_pipeline(url: str, background_tasks: BackgroundTasks):
    task_id = str(uuid4())
    background_tasks.add_task(run_pipeline, task_id, url)
    return {"task_id": task_id, "status": "queued"}

@app.get("/pipeline/{task_id}/status")
async def get_status(task_id: str):
    return task_store.get(task_id)
```

## 실패했던 것들

**네이버 블로그 크롤링이 생각보다 어려웠다**: 네이버 블로그는 iframe 구조라 단순 requests로는 본문을 못 가져온다. Playwright로 실제 브라우저를 띄워 렌더링 후 추출하는 방식으로 해결했다.

**자막 타이밍**: TTS가 예상과 다른 속도로 읽을 때 자막이 음성과 어긋난다. Whisper로 음성을 다시 전사(transcription)해서 실제 타임스탬프를 추출하는 방식으로 보완했다.

## 현재 상태 / 다음 단계

- 전체 파이프라인 동작 확인
- 네이버 블로그 크롤링, 스크립트 생성, FFmpeg 합성, 업로드 동작
- 다양한 배경 템플릿과 자막 스타일 옵션 추가 예정
- 결과 영상 예시 추가 예정

[GitHub 저장소](https://github.com/jean202/blog-to-shorts)
