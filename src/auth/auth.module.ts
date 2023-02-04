import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@/users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { UsersService } from '@/users/users.service';

@Module({
  imports: [ UsersModule, JwtModule, PassportModule, ],
  controllers: [ AuthController, ],
  providers: [ AuthService, JwtStrategy, LocalStrategy, UsersService, ],
})
export class AuthModule {}
