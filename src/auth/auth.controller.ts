import {
  Body,
  Controller, Get, Post, UseGuards
} from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { AuthService } from './auth.service';
import { Auth, GetUser } from './decorator';
import { JwtRefreshAuthGuard, LocalAuthGuard } from './guard';
import { SignUpDto } from './dto/sign-up.dto';
import { TokenPayload } from './types/token-payload.types';
import { UserWithTokens } from './types/user-with-tokens.types';

@Controller('auth')
export class AuthController {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly authService: AuthService
  ) { }

  // ==================== 회원가입 ====================
  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<User> {
    return this.authService.signUp(signUpDto);
  }

  // ==================== 로그인 ====================
  @Post('/signin')
  @UseGuards(LocalAuthGuard)
  async signin(
    @GetUser() user: User
  ): Promise<UserWithTokens> {
    return this.authService.signIn(user);
  }

  // ==================== 내 정보 가져오기 ====================
  @Get('/me')
  @Auth([ UserRole.user, UserRole.admin, ])
  async userInfo(@GetUser() user: User): Promise<User> {
    return user;
  }

  // ==================== 로그아웃 ====================
  @Get('/signout')
  @Auth([ UserRole.user, UserRole.admin, ])
  async signout(@GetUser() user: User): Promise<void> {
    return this.authService.signOut(user);
  }

  // ==================== 액세스 토큰 갱신 ====================
  @Get('/refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(@GetUser() user: TokenPayload): Promise<UserWithTokens> {
    return this.authService.tokenRefresh(user.sub, user.refreshToken);
  }

  // ==================== 회원탈퇴 ====================
  @Get('/withdrawal')
  @Auth([ UserRole.user, UserRole.admin, ])
  async withdrawalUser(@GetUser() user: User): Promise<void> {
    return this.authService.withdrawalUser(user);
  }
}
