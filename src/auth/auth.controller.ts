import {
  Body, Controller, Get, Post, Res, UseGuards
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBody, ApiOperation, ApiResponse, ApiTags
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AuthService } from './auth.service';
import { GetUser, Public, Auth } from './decorator';
import { JwtRefreshAuthGuard, LocalAuthGuard } from './guards';
import { SignInDTO, UserResDTO } from './dto';
import { ErrorResponseDTO, HttpErrorDTO } from '@/common/dto';
import { CreateUserDTO } from '@/user/dto/create-user.dto';
import { UserEntity } from '@/user/entity/user.entity';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  @ApiOperation({
    summary: '회원가입',
    description: '새로운 유저를 생성합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: UserResDTO,
  })
  @ApiResponse({
    status: 400,
    description: '에러',
    type: ErrorResponseDTO,
  })
  @ApiBody({
    type: () => CreateUserDTO,
    description: '회원가입 정보를 전달합니다.',
  })
  async signUp(@Body() createUserDTO: CreateUserDTO) {
    return this.authService.signUp(createUserDTO);
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: '로그인',
    description: '로그인에 성공하면 토큰이 발급됩니다.',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: UserResDTO,
  })
  @ApiResponse({
    status: 400,
    description: '아이디 없음',
    type: HttpErrorDTO,
  })
  @ApiResponse({
    status: 401,
    description: '비밀번호 불일치',
    type: HttpErrorDTO,
  })
  @ApiBody({
    type: SignInDTO,
    description: '로그인 정보를 전달합니다.',
  })
  async signIn(
    @GetUser() user: UserEntity,
    @Res({ passthrough: true, }) res: Response
  ) {
    const { AccessToken, ...ATOption } = await this.authService.createAccessToken(user);
    const { RefreshToken, ...RTOption } = await this.authService.createRefreshToken(user);

    await this.authService.updateRefreshToken(user.id, RefreshToken);

    res.cookie('Authentication', AccessToken, ATOption);
    res.cookie('Refresh', RefreshToken, RTOption);

    const tokenExp = await this.authService.verifyToken(AccessToken);

    return {
      message: '로그인 성공',
      user,
      tokenExp: tokenExp.exp,
    };
  }

  @Public()
  @Post('signout')
  @Auth([ UserRole.ADMIN, UserRole.USER, ])
  @ApiOperation({
    summary: '로그아웃',
    description: '로그아웃을 하고 토큰 정보를 지웁니다.',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
    schema: {
      properties: {
        message: { type: 'string', },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    type: HttpErrorDTO,
  })
  async signOut(
    @GetUser() user: UserEntity,
    @Res({ passthrough: true, }) res: Response
  ) {
    const { accessOption, refreshOption, } = this.authService.signOutWithTokenClear();

    await this.authService.deleteRefreshToken(user.id);

    res.cookie('Authentication', '', accessOption);
    res.cookie('Refresh', '', refreshOption);

    return {
      message: '로그아웃 성공',
    };
  }

  @Get('me')
  @Auth([ UserRole.ADMIN, UserRole.USER, ])
  @ApiOperation({
    summary: '사용자 정보 조회',
    description: '로그인한 유저의 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: () => UserEntity,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    type: HttpErrorDTO,
  })
  async getMe(@GetUser() user: UserEntity) {
    return user;
  }

  @Public()
  @Get('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  @ApiOperation({
    summary: '토큰 갱신',
    description: '토큰이 만료되었을 경우 토큰을 재발급',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: () => UserEntity,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    type: HttpErrorDTO,
  })
  async refresh(
    @GetUser() user: UserEntity,
    @Res({ passthrough: true, }) res: Response
  ) {
    const { AccessToken, ...option } = await this.authService.createAccessToken(user);

    res.cookie('Authentication', AccessToken, option);

    const tokenExp = await this.authService.verifyToken(AccessToken);

    return {
      message: '액세스 토큰 갱신 완료',
      user,
      tokenExp: tokenExp.exp,
    };
  }
}
