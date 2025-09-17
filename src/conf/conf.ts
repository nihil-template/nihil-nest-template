import { registerAs } from '@nestjs/config';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';
import type { Config } from './config.types';

let config: Config = {};

try {
  const configPath = path.join(process.cwd(), 'config.yaml');
  const fileContents = fs.readFileSync(configPath, 'utf8');
  config = yaml.load(fileContents) as Config;
}
catch (error: unknown) {
  const errorMessage = error instanceof Error
    ? error.message
    : '알 수 없는 오류';
  console.warn('config.yaml을 로드할 수 없습니다. 기본값을 사용합니다:', errorMessage);
}

// 서버 설정 객체
export const serverConfig = registerAs('server', () => ({
  port: config.server?.port || 8000,
  host: config.server?.host || 'localhost',
}));

// Swagger 설정 객체
export const swaggerConfig = registerAs('swagger', () => ({
  docsName: config.swagger?.docsName || 'Nest-Next-Mono Template API 문서',
  docsDescription: config.swagger?.docsDescription || 'Nest-Next-Mono Template API 문서',
  docsVersion: config.swagger?.docsVersion || '1.0.0',
  path: config.swagger?.path || 'swagger/docs',
}));

// JWT 설정 객체
export const jwtConfig = registerAs('jwt', () => ({
  access: {
    secret: config.jwt?.access?.secret || 'default-access-secret',
    expiresIn: config.jwt?.access?.expiresIn || '1h',
  },
  refresh: {
    secret: config.jwt?.refresh?.secret || 'default-refresh-secret',
    expiresIn: config.jwt?.refresh?.expiresIn || '30d',
  },
}));

// Nodemailer 설정 객체
export const nodemailerConfig = registerAs('nodemailer', () => ({
  host: config.nodemailer?.host || 'smtp.naver.com',
  port: config.nodemailer?.port || 587,
  secure: config.nodemailer?.secure || false,
  auth: {
    user: config.nodemailer?.auth?.user || '',
    pass: config.nodemailer?.auth?.pass || '',
  },
}));

// 초기 관리자 설정 객체
export const initialAdminConfig = registerAs('initialAdmin', () => ({
  email: config.initialAdmin?.email || 'admin@example.com',
  username: config.initialAdmin?.username || 'admin',
  password: config.initialAdmin?.password || 'changeme123!',
}));

// 데이터베이스 설정 객체
export const databaseConfig = registerAs('database', () => ({
  url: config.database?.url || '',
  host: config.database?.host || 'localhost',
  port: config.database?.port || 5432,
  user: config.database?.user || 'postgres',
  password: config.database?.password || 'postgres',
  name: config.database?.name || 'postgres',
}));

// 앱 설정 객체
export const appConfig = registerAs('app', () => ({
  name: config.app?.name || 'Nest-Next-Mono Template',
  description: config.app?.description || 'NestJS와 Next.js를 사용한 모노레포 풀스택 웹 애플리케이션 템플릿',
  version: config.app?.version || '1.0.0',
  url: config.app?.url || '설정하세요.',
}));

// 전체 설정 객체들을 배열로 내보내기
export default [
  serverConfig,
  swaggerConfig,
  jwtConfig,
  nodemailerConfig,
  initialAdminConfig,
  databaseConfig,
  appConfig,
];
