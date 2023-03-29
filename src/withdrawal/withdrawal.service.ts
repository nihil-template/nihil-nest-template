import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { AuthService } from '@/auth/auth.service';
import { WithdrawalEntity } from './entity/withdrawal.entity';

@Injectable()
export class WithdrawalService {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly prisma: PrismaService,
    // eslint-disable-next-line no-unused-vars
    private readonly authService: AuthService
  ) { }

  // 탈퇴 로그 가져오기
  async getWithdrawals(): Promise<WithdrawalEntity[]> {
    return this.prisma.withdrawal.findMany();
  }

  // 탈퇴 정보 생성
  async createWithdrawal(
    createWithdrawalDto: CreateWithdrawalDto,
    res: Response
  ): Promise<WithdrawalEntity> {
    const { accessOption, refreshOption, } = this.authService.signOutWithTokenClear();

    await this.prisma.user.update({
      where: { id: createWithdrawalDto.userId, },
      data: {
        status: 'WITHDRAW',
      },
    });

    res.cookie('Authentication', '', accessOption);
    res.cookie('Refresh', '', refreshOption);

    await this.prisma.userToken.update({
      where: { id: createWithdrawalDto.userId, },
      data: {
        hashedRefreshToken: null,
      },
    });

    return this.prisma.withdrawal.create({
      data: createWithdrawalDto,
    });
  }
}
