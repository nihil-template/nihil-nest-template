import { registerAs } from '@nestjs/config';

// 서버 설정 객체
export const serverConfig = registerAs('server', () => ({
  port: parseInt(process.env.PORT || '8000', 10),
  host: process.env.HOST || 'localhost',
}));

// Swagger 설정 객체
export const swaggerConfig = registerAs('swagger', () => ({
  docsName: process.env.SWAGGER_DOCS_NAME || 'Nest-Next-Mono Template API 문서',
  docsDescription: process.env.SWAGGER_DOCS_DESCRIPTION || 'Nest-Next-Mono Template API 문서',
  docsVersion: process.env.SWAGGER_DOCS_VERSION || '1.0.0',
  path: process.env.SWAGGER_PATH || 'swagger/docs',
}));

// JWT 설정 객체
export const jwtConfig = registerAs('jwt', () => ({
  access: {
    secret: process.env.JWT_ACCESS_SECRET || 'default-access-secret',
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
}));

// Nodemailer 설정 객체
export const nodemailerConfig = registerAs('nodemailer', () => ({
  host: process.env.NODEMAILER_HOST || 'smtp.naver.com',
  port: parseInt(process.env.NODEMAILER_PORT || '587', 10),
  secure: process.env.NODEMAILER_SECURE === 'true',
  auth: {
    user: process.env.NODEMAILER_USER || '',
    pass: process.env.NODEMAILER_PASS || '',
  },
}));

// 초기 관리자 설정 객체
export const initialAdminConfig = registerAs('initialAdmin', () => ({
  email: process.env.INITIAL_ADMIN_EMAIL || 'admin@example.com',
  username: process.env.INITIAL_ADMIN_USERNAME || 'admin',
  password: process.env.INITIAL_ADMIN_PASSWORD || 'changeme123!',
}));

// 데이터베이스 설정 객체
export const databaseConfig = registerAs('database', () => ({
  url: process.env.DATABASE_URL || '',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  name: process.env.DB_NAME || 'postgres',
}));

// 앱 설정 객체
export const appConfig = registerAs('app', () => ({
  name: process.env.APP_NAME || 'Nest-Next-Mono Template',
  description: process.env.APP_DESCRIPTION || 'NestJS와 Next.js를 사용한 모노레포 풀스택 웹 애플리케이션 템플릿',
  version: process.env.APP_VERSION || '1.0.0',
  url: process.env.APP_URL || '설정하세요.',
}));

// 전체 설정 객체 (기본값)
export default () => ({
  server: serverConfig,
  swagger: swaggerConfig,
  jwt: jwtConfig,
  nodemailer: nodemailerConfig,
  initialAdmin: initialAdminConfig,
  database: databaseConfig,
  app: appConfig,
});
