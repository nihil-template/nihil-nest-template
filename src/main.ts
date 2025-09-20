import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';
import { HttpLoggingInterceptor } from './http-logging.interceptor';
import { swaggerConfig, swaggerUiOptions } from './swagger.config';

import { UnifiedResponseInterceptor } from '@/interceptors/unified-response.interceptor';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: [ 'log', 'error', 'warn', 'debug', 'verbose', ], // 모든 로그 레벨 활성화
    }
  );

  const configService = app.get(ConfigService);

  // Fastify 플러그인 등록
  // NestJS Fastify 어댑터와 플러그인 간의 알려진 타입 호환성 문제
  // @ts-expect-error - NestJS Fastify 어댑터와 플러그인 타입 호환성 문제
  await app.register(fastifyCors, {
    origin: true,
    credentials: true,
    methods: [ 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', ],
    allowedHeaders: [ 'Content-Type', 'Authorization', 'X-Requested-With', ],
  });

  // @ts-expect-error - NestJS Fastify 어댑터와 플러그인 타입 호환성 문제
  await app.register(fastifyCookie);

  // 글로벌 파이프 설정
  app.useGlobalPipes(
    new ZodValidationPipe()
  );

  // 글로벌 인터셉터 설정
  app.useGlobalInterceptors(
    new HttpLoggingInterceptor(),
    new UnifiedResponseInterceptor()
  );

  // 글로벌 필터 설정
  app.useGlobalFilters();

  // Swagger 설정
  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig
  );

  SwaggerModule.setup(
    'api',
    app,
    document,
    swaggerUiOptions
  );

  await app.listen(
    configService.get('server.port'),
    configService.get('server.host')
  );

  const logger = new Logger('Bootstrap');
  logger.log(`🚀 애플리케이션이 http://${configService.get('server.host')}:${configService.get('server.port')} 에서 실행 중입니다.`);
  logger.log(`📚 Swagger 문서는 http://${configService.get('server.host')}:${configService.get('server.port')}/api 에서 확인 가능합니다.`);
  logger.log(`🔧 Swagger 요청은 로그에 🔧 표시로 구분됩니다.`);
}

const handleError = (error: Error): void => {
  new Logger('Bootstrap').error('❌ 애플리케이션 시작에 실패했습니다:', error.stack);
  process.exit(1);
};

bootstrap().catch(handleError);
