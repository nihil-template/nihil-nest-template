import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { dbConfig } from '@/config/db.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ dbConfig, ],
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
