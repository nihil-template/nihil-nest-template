import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '@/users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { DrizzleModule } from '@/drizzle/drizzle.module';
import { UserRepository } from '@/repositories/user.repository';

@Module({
  imports: [
    UsersModule,
    MailerModule,
    DrizzleModule,
    PassportModule.register({ defaultStrategy: 'jwt', }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.access.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.access.expiresIn'),
        },
      }),
      inject: [ ConfigService, ],
    }),
  ],
  controllers: [ AuthController, ],
  providers: [ AuthService, JwtStrategy, UserRepository, ],
})
export class AuthModule { }
