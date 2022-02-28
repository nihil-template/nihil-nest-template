import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from '@hapi/joi';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRY: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ ConfigModule, ],
      inject: [ ConfigService, ],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('host'),
        port: configService.get('port'),
        username: configService.get('user'),
        password: configService.get('password'),
        database: configService.get('database'),
        entities: [ `${__dirname}/**/*.{js,ts}`, ],
        synchronize: true,
      }),
    }),
  ],
  controllers: [ AppController, ],
  providers: [ AppService, ],
})
export class AppModule {}
