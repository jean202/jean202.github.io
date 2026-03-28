---
layout: post
title:  "[NestJS] ValidationPipe와 Pipe 이해하기"
subtitle:   "Node의 pipe와 Nest의 Pipe는 어떻게 다를까"
categories: study
tags: nestjs
comments: true
---

## 왜 헷갈렸을까

NestJS를 처음 보면 `ValidationPipe`라는 이름이 낯설다.
처음에는 Node.js가 기본으로 제공하는 객체인지, 아니면 프로젝트에서 임의로 만든 이름인지 헷갈리기 쉽다.

결론부터 정리하면 `ValidationPipe`는 Node.js 기본 객체가 아니라 NestJS가 제공하는 내장 클래스다.
보통 아래처럼 `@nestjs/common`에서 가져와 사용한다.

```ts
import { ValidationPipe } from '@nestjs/common';
```

즉, 이 이름은 프로젝트에서 마음대로 지은 것이 아니라 NestJS가 공식적으로 제공하는 이름이다.

## Nest에서 Pipe는 무엇인가

Nest에서 `Pipe`는 컨트롤러가 값을 받기 전에 실행되는 처리 단계다.
이 단계에서 주로 두 가지 일을 한다.

- 요청 데이터를 원하는 타입으로 변환한다.
- 요청 데이터가 규칙에 맞는지 검증한다.

예를 들어 `@Body()`, `@Param()`, `@Query()`로 들어오는 값은 모두 Pipe를 통과시킬 수 있다.
그래서 Pipe는 "컨트롤러로 값을 넘기기 직전에 한 번 거르는 필터"처럼 이해하면 편하다.

## Node의 pipe와 Nest의 Pipe 차이

둘 다 이름은 비슷하지만 의미는 조금 다르다.

Node.js에서 `pipe`는 보통 stream을 연결할 때 쓴다.

```ts
readStream.pipe(gzip).pipe(res);
```

이 경우의 `pipe`는 데이터 흐름을 다음 단계로 넘긴다는 의미다.

반면 Nest의 `Pipe`는 HTTP 요청 처리 과정에서 값 자체를 변환하거나 검증하는 역할이다.

정리하면 다음과 같다.

- Node의 `pipe`는 데이터 흐름 연결에 가깝다.
- Nest의 `Pipe`는 컨트롤러에 들어갈 값의 변환과 검증에 가깝다.

## ValidationPipe는 무엇을 하는가

`ValidationPipe`는 NestJS의 대표적인 검증용 Pipe다.
주로 DTO와 함께 사용하며, 들어온 요청 데이터가 DTO 규칙에 맞는지 검사한다.

예를 들어 `main.ts`에서 전역으로 등록하면 모든 요청에 공통으로 적용할 수 있다.

```ts
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
);
```

여기서 "전역 ValidationPipe 적용"이라는 말은 위 설정을 `main.ts`에 넣어서 모든 API 요청에 공통 검증 규칙을 적용하라는 뜻이다.

## 옵션 세 가지 의미

### 1. transform

`transform: true`는 요청으로 들어온 값을 DTO 타입에 맞게 변환하려는 옵션이다.

예를 들어 숫자처럼 다뤄야 하는 값이 문자열로 들어왔을 때, Nest가 DTO 기준으로 타입 변환을 시도할 수 있다.
즉, 단순히 값만 받는 것이 아니라 컨트롤러가 기대하는 형태로 정리해 주는 역할이다.

### 2. whitelist

`whitelist: true`는 DTO에 정의되지 않은 속성을 제거하는 옵션이다.

예를 들어 DTO에 `name`, `age`만 있는데 요청에 `admin: true` 같은 값이 추가로 들어오면, 그 값은 제거된다.
허용한 필드만 남긴다는 의미다.

### 3. forbidNonWhitelisted

`forbidNonWhitelisted: true`는 DTO에 없는 값이 들어왔을 때 그냥 제거만 하지 않고 에러를 발생시키는 옵션이다.

즉, "정의하지 않은 필드를 보냈으니 잘못된 요청"이라고 명확하게 막는다.
실수로 잘못된 데이터를 보내는 경우를 빨리 발견하는 데 도움이 된다.

## class-validator 데코레이터는 무엇인가

`class-validator` 데코레이터는 DTO 클래스의 필드에 붙여서 "이 값은 이런 규칙을 만족해야 한다"라고 선언하는 도구다.

Java 개발자 기준으로 보면 Bean Validation 어노테이션과 매우 비슷하다.
즉, DTO에 검증 규칙을 붙여 두고, 요청이 들어왔을 때 그 규칙을 기준으로 검사한다고 이해하면 된다.

예를 들어 아래처럼 쓸 수 있다.

```ts
import { IsEmail, IsInt, IsNotEmpty, Length, Min } from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  @Length(1, 100)
  title: string;

  @IsInt()
  @Min(1900)
  year: number;

  @IsEmail()
  directorEmail: string;
}
```

위 코드는 다음 뜻이다.

- `title`은 비어 있으면 안 된다.
- `title` 길이는 1자 이상 100자 이하여야 한다.
- `year`는 정수여야 한다.
- `year`는 1900 이상이어야 한다.
- `directorEmail`은 이메일 형식이어야 한다.

## Java Bean Validation과 비교

완전히 1:1은 아니지만 감을 잡기에는 아래 대응이 가장 이해하기 쉽다.

| Nest `class-validator` | Java Bean Validation 느낌 | 의미 |
| --- | --- | --- |
| `@IsDefined()` | `@NotNull` | 값이 반드시 있어야 함 |
| `@IsNotEmpty()` | `@NotBlank`, `@NotEmpty` 사이 | 빈 문자열이나 빈 값 방지 |
| `@IsOptional()` | 조건부 검증에 가까움 | 값이 없으면 다른 검증을 건너뜀 |
| `@IsString()` | 타입 체크 개념 | 문자열이어야 함 |
| `@IsInt()` | 정수 타입 체크 | 정수여야 함 |
| `@IsNumber()` | 숫자 타입 체크 | 숫자여야 함 |
| `@Min(1)` | `@Min(1)` | 최소값 제한 |
| `@Max(10)` | `@Max(10)` | 최대값 제한 |
| `@Length(2, 20)` | `@Size(min = 2, max = 20)` | 문자열 길이 제한 |
| `@IsEmail()` | `@Email` | 이메일 형식 검사 |
| `@Matches(/.../)` | `@Pattern` | 정규식 검사 |
| `@IsBoolean()` | 타입 체크 개념 | boolean 이어야 함 |
| `@IsArray()` | 컬렉션 타입 체크 느낌 | 배열이어야 함 |
| `@ArrayMinSize(1)` | `@Size(min = 1)` | 배열 원소 개수 제한 |
| `@ValidateNested()` | `@Valid` | 중첩 객체까지 검증 |
| `@IsDateString()` | 날짜 형식 검증 | ISO 날짜 문자열 검사 |

## Java 개발자 관점에서 헷갈릴 수 있는 점

- `title: string`처럼 TypeScript 타입만 적는다고 런타임 검증이 되지는 않는다.
- 실제 검증은 `@IsString()`, `@IsEmail()` 같은 데코레이터와 `ValidationPipe`가 함께 수행한다.
- `@IsOptional()`은 null 허용이라기보다 값이 없으면 검증을 생략하는 쪽에 가깝다.
- `@IsNotEmpty()`는 단순 null 체크보다 강해서 빈 문자열도 막는다.

## Java와 Nest 비교 예시

Java에서는 보통 아래처럼 쓴다.

```java
public class CreateMovieRequest {
    @NotBlank
    @Size(min = 1, max = 100)
    private String title;

    @Min(1900)
    private int year;

    @Email
    private String directorEmail;
}
```

Nest에서는 아래처럼 대응된다.

```ts
import { IsEmail, IsInt, IsNotEmpty, Length, Min } from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  @Length(1, 100)
  title: string;

  @IsInt()
  @Min(1900)
  year: number;

  @IsEmail()
  directorEmail: string;
}
```

즉, Java의 검증 어노테이션 역할을 Nest에서는 `class-validator` 데코레이터가 맡는다고 보면 된다.

## ValidationPipe와 class-validator의 관계

둘은 따로 있지만 같이 동작한다.

- `class-validator` 데코레이터는 DTO에 검증 규칙을 적어 둔다.
- `ValidationPipe`는 요청이 들어왔을 때 그 규칙을 실제로 읽고 실행한다.

그래서 `ValidationPipe`만 있고 DTO 데코레이터가 없으면 검사할 규칙이 부족하고,
DTO 데코레이터만 있고 `ValidationPipe`가 없으면 요청 시 자동 검증이 제대로 일어나지 않는다.

## 한 번에 정리

- `ValidationPipe`는 Node.js 기본 객체가 아니라 NestJS 내장 클래스다.
- Nest의 `Pipe`는 컨트롤러에 값이 들어가기 전 변환과 검증을 담당한다.
- Node의 `pipe`는 stream 같은 데이터 흐름을 연결하는 개념이다.
- `transform`은 값 변환, `whitelist`는 허용되지 않은 필드 제거, `forbidNonWhitelisted`는 허용되지 않은 필드에 대한 에러 처리다.
- `class-validator` 데코레이터는 DTO 필드에 붙이는 검증 규칙 선언이다.
- Java의 Bean Validation 어노테이션과 비슷하게 이해하면 편하다.

## 내가 이해한 문장 해석

`nest/src/main.ts`

- 전역 `ValidationPipe` 적용
- 옵션은 `transform`, `whitelist`, `forbidNonWhitelisted`

이 문장을 풀어 쓰면 다음 뜻이다.

"`main.ts`에서 `ValidationPipe`를 전역 등록해서 모든 요청에 검증 규칙을 적용하고, 요청 데이터는 필요한 형태로 변환하고, DTO에 없는 필드는 막아라."
