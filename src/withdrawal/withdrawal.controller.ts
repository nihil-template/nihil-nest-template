import {
  Body,
  Controller, Get, Post, Res, UseGuards
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { WithdrawalService } from './withdrawal.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { JwtAdminAuthGuard, JwtAuthGuard } from '@/auth/guards';
import { HttpErrorDTO } from '@/common/dto';
import { WithdrawalEntity } from './entity/withdrawal.entity';

@Controller('withdrawal')
@ApiTags('Withdrawal')
export class WithdrawalController {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly withdrawalService: WithdrawalService
  ) { }

  @Get()
  @UseGuards(JwtAdminAuthGuard)
  @ApiOperation({
    summary: '탈퇴 로그 조회',
    description: '모든 탈퇴 로그를 조회합니다.',
  })
  @ApiResponse({
    status: 401,
    type: HttpErrorDTO,
    description: '관리자 계정이 아닐 경우.',
  })
  @ApiResponse({
    status: 200,
    type: () => WithdrawalEntity,
    isArray: true,
    description: '조회 성공',
  })
  async getWithdrawals() {
    return this.withdrawalService.getWithdrawals();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '회원탈퇴',
    description: '회원탈퇴 처리를 하고 토큰을 없앱니다.',
  })
  @ApiResponse({
    status: 401,
    type: HttpErrorDTO,
    description: '인증 실패',
  })
  @ApiResponse({
    status: 200,
    type: () => WithdrawalEntity,
    description: '회원 탈퇴 성공',
  })
  async createWithdrawal(
    @Body() createWithdrawalDto: CreateWithdrawalDto,
    @Res() res: Response
  ) {
    return this.withdrawalService.createWithdrawal(createWithdrawalDto, res);
  }
}
