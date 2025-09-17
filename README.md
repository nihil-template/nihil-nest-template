# NestJS API Server

> 타입스크립트와 NestJS로 구축된 풀스택 웹 애플리케이션용 REST API 서버

## 🚀 시작하기

### 설치
```bash
pnpm install
```

### 개발 서버 실행
```bash
pnpm run dev
```

### 빌드 및 프로덕션
```bash
pnpm run build
pnpm run start:prod
```

## 📚 API 문서

서버 실행 후 Swagger UI를 통해 API 문서를 확인할 수 있습니다:
- **개발환경**: http://localhost:3000/api
- **프로덕션**: https://your-domain.com/api

## 🛠 기술 스택

- **프레임워크**: NestJS 11 + Fastify
- **언어**: TypeScript
- **데이터베이스**: PostgreSQL + Drizzle ORM
- **인증**: JWT (쿠키 기반)
- **문서화**: Swagger/OpenAPI
- **이메일**: Nodemailer
- **검증**: Zod

## 🏗 프로젝트 구조

```
src/
├── auth/               # 🔐 인증 (로그인, 회원가입, JWT)
├── users/              # 👥 사용자 관리
├── admin/              # 👑 관리자 기능
├── drizzle/            # 🗄️ 데이터베이스 스키마 & 설정
├── repositories/       # 📊 데이터 접근 계층
├── utils/              # 🔧 유틸리티 함수
├── dto/                # 📝 데이터 전송 객체
├── code/               # 📋 응답 코드 & 메시지
└── conf/               # ⚙️ 설정 파일
```

## ✨ 주요 기능

### 인증 시스템
- JWT 기반 로그인/로그아웃
- 쿠키 기반 토큰 저장 (보안 강화)
- 토큰 자동 갱신
- 비밀번호 재설정 (이메일)

### 사용자 관리
- 회원가입/탈퇴
- 프로필 수정
- 사용자 목록 조회
- 이메일/ID 기반 검색

### 보안 기능
- API 요청 제한 (60회/분)
- CORS 설정
- 입력 검증 (Zod)
- 비밀번호 암호화 (bcrypt)

## 🔧 개발 명령어

```bash
# 개발 서버
pnpm run dev

# 린팅
pnpm run lint
pnpm run lint:fix

# 빌드
pnpm run build

# 프로덕션 실행
pnpm run start:prod
```

## 📡 주요 API 엔드포인트

### 인증
- `POST /auth/signup` - 회원가입
- `POST /auth/signin` - 로그인
- `POST /auth/signout` - 로그아웃
- `POST /auth/refresh` - 토큰 갱신
- `GET /auth/session` - 세션 조회

### 사용자
- `GET /users` - 사용자 목록
- `GET /users/:id` - 사용자 상세
- `PUT /users/profile` - 프로필 수정

## 🌟 특징

- **타입 안전성**: TypeScript + Zod를 통한 엄격한 타입 검증
- **모듈화**: NestJS 모듈 시스템으로 깔끔한 코드 구조
- **성능**: Fastify 어댑터로 빠른 처리 속도
- **문서화**: Swagger로 자동 생성되는 API 문서
- **모니터링**: 요청/응답 로깅 및 처리 시간 측정

## 📝 설정

### 설정 파일

모든 설정은 `config.yaml` 파일로 관리됩니다:

1. `config.example.yaml`을 `config.yaml`로 복사
2. 필요한 값들을 수정
3. 설정 타입은 `src/conf/config.types.ts`에 정의됨
4. 설정 로딩은 `src/conf/conf.ts`에서 처리

```bash
# 설정 파일 생성
cp config.example.yaml config.yaml
```

### 주요 설정 항목

- **server**: 서버 포트, 호스트
- **jwt**: 액세스/리프레시 토큰 설정
- **database**: 데이터베이스 연결 정보
- **nodemailer**: 이메일 발송 설정
- **swagger**: API 문서 설정
