import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from '@/auth/auth.service';

@Module({
  controllers: [ UsersController, ],
  providers: [ UsersService, AuthService, JwtService, ConfigService, ],
  exports: [ UsersService, ],
})
export class UsersModule {}
