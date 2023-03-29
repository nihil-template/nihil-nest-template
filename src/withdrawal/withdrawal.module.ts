import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WithdrawalService } from './withdrawal.service';
import { WithdrawalController } from './withdrawal.controller';
import { AuthService } from '@/auth/auth.service';

@Module({
  providers: [ WithdrawalService, AuthService, JwtService, ConfigService, ],
  controllers: [ WithdrawalController, ],
})
export class WithdrawalModule {}
