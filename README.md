# Nest-Next-Mono Template - API Server

## 1. 프로젝트 개요

Nest-Next-Mono Template의 NestJS API 서버입니다. NestJS와 Drizzle ORM을 활용한 타입 안전한 백엔드 API 서버로, JWT 인증, 사용자 관리, 이메일 서비스 등 풀스택 애플리케이션에 필요한 핵심 기능들을 제공합니다.

### 주요 기능

- 인증 시스템: JWT 기반 인증 (쿠키 저장)
- 사용자 관리: 회원가입, 로그인, 프로필 관리
- 이메일 서비스: 비밀번호 재설정 이메일
- 보안: API 요청 제한, CORS, Helmet
- API 문서: Swagger 자동 문서화
- 데이터베이스: Drizzle ORM, PostgreSQL
- 성능: 요청 제한, 캐싱, 최적화

## 2. 프로젝트 스택

### 백엔드

- 프레임워크: NestJS 11
- 언어: TypeScript
- 데이터베이스: PostgreSQL + Drizzle ORM
- 인증: JWT, Passport
- 이메일: Nodemailer
- 문서화: Swagger/OpenAPI

### 보안

- 인증: JWT 토큰 (쿠키 기반)
- 요청 제한: Throttler
- 보안 헤더: Helmet
- CORS: Cross-Origin Resource Sharing

### 개발 도구

- 패키지 관리: pnpm
- 린팅: ESLint
- 타입 체크: TypeScript
- 마이그레이션: Drizzle

### 프로젝트 구조

```
src/
├── auth/              # 인증 모듈
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── jwt.strategy.ts
│   └── jwt-auth.guard.ts
├── users/             # 사용자 모듈
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── admin/             # 관리자 모듈
├── drizzle/           # Drizzle 설정
├── repositories/      # 데이터 접근 계층
├── utils/             # 유틸리티 함수
├── conf/              # 설정 관리
├── app.module.ts      # 루트 모듈
└── main.ts           # 애플리케이션 진입점
```

## 3. 프로젝트의 규칙

### 아키텍처 규칙

1. **모듈 기반 구조**: 모든 기능은 NestJS 모듈로 분리하여 관리
2. **계층 분리**: Controller → Service → Repository → Database 순서로 계층 분리
3. **의존성 주입**: 모든 의존성은 NestJS DI 컨테이너를 통해 관리
4. **글로벌 설정**: ConfigModule을 통한 중앙화된 설정 관리

### 코드 규칙

1. **타입 안전성**: 모든 데이터는 TypeScript 타입과 Zod 스키마로 검증
2. **DTO 패턴**: 모든 API 입출력은 DTO를 통해 타입 안전하게 처리
3. **Repository 패턴**: 데이터 접근 로직은 Repository 클래스로 분리
4. **에러 처리**: createError, createResponse 유틸리티를 통한 일관된 응답 형식

### 네이밍 규칙

1. **파일명**: kebab-case 사용 (auth.controller.ts)
2. **클래스명**: PascalCase 사용 (AuthController)
3. **메서드명**: camelCase 사용 (getUserInfo)
4. **상수명**: UPPER_SNAKE_CASE 사용 (RESPONSE_CODE)

### API 규칙

1. **Swagger 문서화**: 모든 엔드포인트는 @ApiOperation, @ApiResponse 데코레이터 필수
2. **인증 가드**: 보호된 엔드포인트는 @UseGuards(JwtAuthGuard) 필수
3. **요청 제한**: 민감한 엔드포인트는 @Throttle 데코레이터로 제한
4. **응답 형식**: 모든 API 응답은 createResponse 또는 createError로 통일

### 데이터베이스 규칙

1. **Drizzle ORM**: Prisma 대신 Drizzle ORM 사용
2. **스키마 분리**: @repo/drizzle 패키지에서 스키마 정의 후 임포트
3. **Raw SQL**: 복잡한 쿼리는 Raw SQL 사용 (sql`` 템플릿 리터럴)
4. **트랜잭션**: 데이터 일관성이 필요한 작업은 트랜잭션 사용

### 설정 관리 규칙

1. **환경변수**: DATABASE_URL만 환경변수로 관리
2. **중앙화된 설정**: 나머지 설정은 src/conf/conf.ts에서 관리
3. **타입 안전성**: 모든 설정은 registerAs를 통한 타입 안전한 설정 객체
4. **기본값**: 모든 설정은 적절한 기본값 제공

### 패키지 규칙

1. **@repo/dto**: 모든 DTO는 @repo/dto 패키지에서 관리
2. **@repo/drizzle**: 데이터베이스 스키마는 @repo/drizzle 패키지에서 관리
3. **@repo/message**: 메시지와 응답 코드는 @repo/message 패키지에서 관리
4. **내부 임포트**: 프로젝트 내부 모듈은 @/ 경로 별칭 사용

### 보안 규칙

1. **JWT 토큰**: HttpOnly 쿠키로 저장하여 XSS 방지
2. **비밀번호**: bcrypt를 통한 해시 처리
3. **요청 제한**: Throttler를 통한 API 호출 제한
4. **CORS**: 적절한 CORS 설정으로 CSRF 방지

### 개발 규칙

1. **ESLint**: 코드 품질을 위한 ESLint 규칙 준수
2. **TypeScript**: strict 모드 활성화
3. **에러 처리**: 모든 비동기 작업은 try-catch로 에러 처리
4. **로깅**: HttpLoggingInterceptor를 통한 요청/응답 로깅

이러한 규칙들은 프로젝트의 일관성, 유지보수성, 확장성을 보장하며, 팀 개발 시 코드 품질을 유지하는 기준이 됩니다.
