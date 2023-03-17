import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  app.enableCors();
  app.use(helmet());
  app.use(cookieParser());

  await app.listen(4000);

  const logger = new Logger('NestApplication');

  const config = new DocumentBuilder()
    .setTitle('API문서명')
    .setDescription('API문서 설명')
    .setVersion('1.0') // API 버전
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'Token', },
      'access-token'
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  logger.log('서버가 4000포트에서 실행되고 있습니다.');
}
bootstrap();
