import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtRefreshStrategy, JwtStrategy } from './strategies';

@Module({
  imports: [ JwtModule, PassportModule, ],
  providers: [
    AuthService,
    JwtService,
    ConfigService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  controllers: [ AuthController, ],
})
export class AuthModule {}
