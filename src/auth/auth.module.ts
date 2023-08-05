import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '@/users/users.module';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtRefreshStrategy, JwtStrategy } from './strategy';

@Module({
  imports: [ UsersModule, PassportModule, JwtModule, ],
  controllers: [ AuthController, ],
  providers: [ AuthService, LocalStrategy, ConfigService, JwtStrategy, JwtRefreshStrategy, ],
  exports: [ AuthService, ],
})
export class AuthModule {}
