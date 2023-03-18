import {
  Body, Controller, Get, Post, Res, UseGuards
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '@/users/dto';
import { GetUser } from './get.user.decorator';
import { UserEntity } from '@/common/entity';
import { JwtAuthGuard, JwtRefreshAuthGuard, LocalAuthGuard } from './guards';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  async signUp(@Body() createUserDTO: CreateUserDTO) {
    return this.authService.signUp(createUserDTO);
  }

  @Post('signin')
  @ApiOperation({
    summary: '로그인',
    description: '로그인에 성공하면 토큰이 발급됩니다.',
  })
  @ApiResponse({ status: 200, description: '', type: UserEntity, })
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string', example: 'nihil_ncunia@naver.com', },
        password: { type: 'string', example: '1234567', },
      },
    },
  })
  @UseGuards(LocalAuthGuard)
  async signIn(
    @GetUser() user: UserEntity,
    @Res({ passthrough: true, }) res: Response
  ) {
    const { AccessToken, ...ATOption } = await this.authService.createAccessToken(user);
    const { RefreshToken, ...RTOption } = await this.authService.createRefreshToken(user);

    await this.authService.updateRefreshToken(user.id, RefreshToken);

    res.cookie('Authentication', AccessToken, ATOption);
    res.cookie('Refresh', RefreshToken, RTOption);

    delete user.hashedRefreshToken;

    return {
      message: '로그인 성공',
      user,
    };
  }

  @Public()
  @Get('signout')
  @UseGuards(JwtRefreshAuthGuard)
  async signOut(
    @GetUser() user: UserEntity,
    @Res({ passthrough: true, }) res: Response
  ) {
    const { accessOption, refreshOption, } = await this.authService.signOutWithTokenClear();

    await this.authService.deleteRefreshToken(user.id);

    res.cookie('Authentication', '', accessOption);
    res.cookie('Refresh', '', refreshOption);

    return {
      message: '로그아웃 성공',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@GetUser() user: UserEntity) {
    return user;
  }

  @Public()
  @Get('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refresh(
    @GetUser() user: UserEntity,
    @Res({ passthrough: true, }) res: Response
  ) {
    const { AccessToken, ...option } = await this.authService.createAccessToken(user);

    res.cookie('Authentication', AccessToken, option);
    return user;
  }
}
