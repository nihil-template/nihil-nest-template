# Nest-Next-Mono Template - API Server

Nest-Next-Mono Template의 NestJS API 서버입니다. NestJS와 Prisma를 활용한 타입 안전한 백엔드 API 서버로, JWT 인증, 사용자 관리, 이메일 서비스 등 풀스택 애플리케이션에 필요한 핵심 기능들을 제공합니다.

## 주요 기능

- **🔐 인증 시스템**: JWT 기반 인증 (쿠키 저장)
- **👥 사용자 관리**: 회원가입, 로그인, 프로필 관리
- **📧 이메일 서비스**: 비밀번호 재설정 이메일
- **🛡️ 보안**: API 요청 제한, CORS, Helmet
- **📚 API 문서**: Swagger 자동 문서화
- **🗄️ 데이터베이스**: Prisma ORM, PostgreSQL
- **⚡ 성능**: 요청 제한, 캐싱, 최적화

## 기술 스택

### 백엔드

- **프레임워크**: NestJS 11
- **언어**: TypeScript
- **데이터베이스**: PostgreSQL + Prisma ORM
- **인증**: JWT, Passport
- **이메일**: Nodemailer
- **문서화**: Swagger/OpenAPI

### 보안

- **인증**: JWT 토큰 (쿠키 기반)
- **요청 제한**: Throttler
- **보안 헤더**: Helmet
- **CORS**: Cross-Origin Resource Sharing

### 개발 도구

- **패키지 관리**: pnpm
- **린팅**: ESLint
- **타입 체크**: TypeScript
- **마이그레이션**: Prisma

## 프로젝트 구조

```
apps/api/
├── src/
│   ├── auth/              # 인증 모듈
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── jwt.strategy.ts
│   │   └── jwt-auth.guard.ts
│   ├── users/             # 사용자 모듈
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── prisma/            # Prisma 설정
│   │   └── prisma.module.ts
│   ├── app.module.ts      # 루트 모듈
│   ├── main.ts           # 애플리케이션 진입점
│   └── swagger.config.ts # Swagger 설정
├── prisma/               # Prisma 스키마
│   ├── schema.prisma
│   └── migrations/
└── messages/             # 다국어 메시지
```

## 설치 및 실행

### 필수 요구사항

- Node.js 18+
- pnpm 8+
- PostgreSQL 데이터베이스

### 설치

```bash
# 의존성 설치
pnpm install

# 환경변수 설정
cp .env.example .env
```

### 환경변수 설정

```env
# 데이터베이스 (필수)
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
```

### 설정 관리

**환경변수**: 데이터베이스 연결을 위한 `DATABASE_URL`만 사용

**중앙화된 설정**: 나머지 모든 설정은 `@repo/config` 패키지를 통해 관리

- JWT 설정, 이메일 설정, 서버 설정 등
- 설정 파일 위치: `packages/config/server.config.ts`

### 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
pnpm prisma generate

# 마이그레이션 실행
pnpm prisma migrate dev

# (선택) 시드 데이터 추가
pnpm prisma db seed

# (선택) Prisma Studio 실행
pnpm prisma studio
```

### 개발 서버 실행

```bash
# 개발 모드
pnpm dev

# 또는 터보레포를 통한 실행
pnpm dev --filter=api

# 프로덕션 모드
pnpm start:prod
```

서버는 `http://localhost:8000`에서 실행됩니다.

## API 엔드포인트

### 인증 (Auth)

| 메서드 | 엔드포인트              | 설명             | 인증 필요 |
| ------ | ----------------------- | ---------------- | --------- |
| POST   | `/auth/signup`          | 회원가입         | ❌        |
| POST   | `/auth/signin`          | 로그인           | ❌        |
| POST   | `/auth/signout`         | 로그아웃         | ✅        |
| POST   | `/auth/forgot-password` | 비밀번호 찾기    | ❌        |
| POST   | `/auth/reset-password`  | 비밀번호 재설정  | ❌        |
| POST   | `/auth/change-password` | 비밀번호 변경    | ✅        |
| GET    | `/auth/me`              | 현재 사용자 정보 | ✅        |
| POST   | `/auth/refresh`         | 토큰 갱신        | ❌        |

### 사용자 (Users)

| 메서드 | 엔드포인트              | 설명                 | 인증 필요 |
| ------ | ----------------------- | -------------------- | --------- |
| GET    | `/users`                | 전체 사용자 목록     | ❌        |
| GET    | `/users/:userId`        | 특정 사용자 정보     | ✅        |
| GET    | `/users/email/:emlAddr` | 이메일로 사용자 조회 | ✅        |

## 주요 기능 설명

### 인증 시스템

- **JWT 토큰**: Access Token (1시간) + Refresh Token (30일)
- **쿠키 저장**: HttpOnly 쿠키로 안전한 토큰 저장
- **자동 갱신**: Refresh Token을 통한 자동 토큰 갱신
- **보안**: CSRF 방지, XSS 방지

### 사용자 관리

- **회원가입**: 이메일, 사용자명, 비밀번호 검증
- **로그인**: 이메일/비밀번호 인증
- **프로필**: 사용자 정보 조회 및 수정
- **권한**: USER/ADMIN 역할 기반 권한 관리

### 이메일 서비스

- **비밀번호 재설정**: 이메일을 통한 비밀번호 재설정
- **템플릿**: HTML 이메일 템플릿 지원
- **보안**: 토큰 기반 재설정 링크

### 보안 기능

- **요청 제한**: IP별 API 호출 제한
- **CORS**: Cross-Origin 요청 제어
- **Helmet**: 보안 헤더 설정
- **입력 검증**: Zod 기반 데이터 검증

## 개발 가이드

### 새로운 모듈 추가

```typescript
// src/posts/posts.module.ts
import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
```

### 새로운 컨트롤러 추가

```typescript
// src/posts/posts.controller.ts
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { PostsService } from './posts.service';
import { CreatePostDto } from '@repo/dto/DTO';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: '게시글 생성' })
  @ApiResponse({ status: 201, description: '게시글 생성 성공' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }
}
```

### 새로운 서비스 추가

```typescript
// src/posts/posts.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePostDto } from '@repo/dto/DTO';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: createPostDto,
    });
  }
}
```

## 데이터베이스 관리

### 마이그레이션

```bash
# 새로운 마이그레이션 생성
pnpm prisma migrate dev --name add_posts_table

# 프로덕션 마이그레이션
pnpm prisma migrate deploy
```

### 스키마 수정

```prisma
// prisma/schema.prisma
model Post {
  postId    String   @id @default(uuid()) @map("post_id")
  title     String   @map("title")
  content   String   @map("content")
  userId    String   @map("user_id")
  user      UserInfo @relation(fields: [userId], references: [userId])

  // 메타데이터
  crtDt     DateTime @default(now()) @map("crt_dt")
  updtDt    DateTime @updatedAt @map("updt_dt")
  delDt     DateTime? @map("del_dt")

  @@map("post")
}
```

## 배포

### 빌드

```bash
# 프로덕션 빌드
pnpm build

# 또는 터보레포를 통한 빌드
pnpm build --filter=api
```

### 서버 실행

```bash
# 프로덕션 모드
pnpm start:prod
```

### Docker 배포

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 8000

CMD ["node", "dist/main"]
```

## API 문서

개발 서버 실행 후 `http://localhost:8000/api`에서 Swagger 문서를 확인할 수 있습니다.

## 요약

이 NestJS API 서버는 Nest-Next-Mono Template의 백엔드 서버로, 현대적인 백엔드 개발에 필요한 모든 핵심 기능을 제공합니다. 타입 안전성, 보안, 성능을 고려한 설계로 확장 가능하고 유지보수하기 쉬운 API를 구축할 수 있습니다.
