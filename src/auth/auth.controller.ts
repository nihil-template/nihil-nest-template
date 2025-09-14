import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  Req,
  Get,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { FastifyRequest, FastifyReply } from 'fastify';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiOkResponse
} from '@nestjs/swagger';
import {
  CreateUserDto,
  SignInDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  type UserInfoDto,
  type ResponseDto
} from '@repo/dto';
import { WithdrawDto } from '@repo/dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtPayload } from './jwt.strategy';
import { MESSAGE_CODE, RESPONSE_CODE } from '@repo/message';
import { createExampleUser } from '@/utils/createExampleUser';
import { createError, createResponse } from '@/utils';
import { setCookie, clearCookie } from '@/utils/setCookie';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /**
   * 회원가입
   * @param signUpData 회원가입 데이터
   * @returns 회원가입 결과
   */
  @ApiOperation({
    summary: '회원가입',
    description: '새로운 사용자 계정을 생성합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '회원가입 성공',
    schema: {
      example: {
        error: false,
        code: RESPONSE_CODE.CREATED,
        message: MESSAGE_CODE.SIGN_UP_SUCCESS,
        data: createExampleUser(),
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '이미 존재하는 이메일',
    schema: {
      example: {
        error: true,
        code: RESPONSE_CODE.CONFLICT,
        message: MESSAGE_CODE.CONFLICT_EMAIL,
        data: null,
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signUp(
    @Body() signUpData: CreateUserDto
  ): Promise<ResponseDto<UserInfoDto>> {
    return this.authService.signUp(signUpData);
  }

  /**
   * 로그인
   * @param signInData 로그인 데이터
   * @param res 응답 객체
   * @returns 로그인 결과
   */
  @ApiOperation({
    summary: '로그인',
    description: '사용자 인증을 처리하고 JWT 토큰을 발급합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    schema: {
      example: {
        error: false,
        code: RESPONSE_CODE.SUCCESS,
        message: MESSAGE_CODE.SIGN_IN_SUCCESS,
        data: createExampleUser(),
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '인증 실패',
    schema: {
      example: {
        error: true,
        code: RESPONSE_CODE.UNAUTHORIZED,
        message: MESSAGE_CODE.INVALID_CREDENTIALS,
        data: null,
      },
    },
  })
  @Throttle({ default: { limit: 5, ttl: 60000, }, })
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(
    @Body() signInData: SignInDto,
    @Res({ passthrough: true, }) res: FastifyReply,
    @Req() req: FastifyRequest
  ): Promise<ResponseDto<UserInfoDto>> {
    const result = await this.authService.signIn(signInData);

    // 에러 응답인 경우 그대로 반환
    if ('error' in result && result.error) {
      return result;
    }

    // 성공 응답인 경우 쿠키 설정
    const { user, acsToken, reshToken, accessTokenExpiresAt, } = result as {
      user: UserInfoDto;
      acsToken: string;
      reshToken: string;
      accessTokenExpiresAt: number;
    };

    setCookie(
      res,
      'accessToken',
      acsToken,
      60
    );
    setCookie(
      res,
      'refreshToken',
      reshToken,
      30 * 24 * 60
    );
    setCookie(
      res,
      'accessTokenExpiresAt',
      accessTokenExpiresAt.toString(),
      0,
      false
    );

    // Swagger에서 테스트를 위한 로그인 요청인 경우 토큰을 응답에 포함
    if (req.headers[ 'x-swagger-login' ] === 'true') {
      return createResponse(
        'SUCCESS',
        'SIGN_IN_SUCCESS',
        {
          ...user,
          acsToken: acsToken,
        }
      );
    }

    return createResponse(
      'SUCCESS',
      'SIGN_IN_SUCCESS',
      user
    );
  }

  /**
   * 토큰 재발급
   * @param req 요청 객체
   * @param res 응답 객체
   * @returns 재발급 결과
   */
  @ApiOperation({
    summary: '토큰 재발급',
    description: '리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '토큰 재발급 성공',
    schema: {
      example: {
        error: false,
        code: RESPONSE_CODE.SUCCESS,
        message: MESSAGE_CODE.TOKEN_REFRESH_SUCCESS,
        data: createExampleUser(),
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '리프레시 토큰이 유효하지 않음',
    schema: {
      example: {
        error: true,
        code: RESPONSE_CODE.UNAUTHORIZED,
        message: MESSAGE_CODE.INVALID_REFRESH_TOKEN,
        data: null,
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshToken(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true, }) res: FastifyReply
  ): Promise<ResponseDto<UserInfoDto>> {
    const refreshToken = req.cookies[ 'refreshToken' ];

    if (!refreshToken) {
      return createError('UNAUTHORIZED', 'REFRESH_TOKEN_NOT_FOUND');
    }

    const result = await this.authService.refresh(refreshToken);

    // 에러 응답인 경우 그대로 반환
    if ('error' in result && result.error) {
      return result;
    }

    // 성공 응답인 경우 쿠키 설정
    const { user, acsToken, reshToken, accessTokenExpiresAt, } = result as {
      user: UserInfoDto;
      acsToken: string;
      reshToken: string;
      accessTokenExpiresAt: number;
    };

    setCookie(
      res,
      'accessToken',
      acsToken,
      60
    );

    setCookie(
      res,
      'refreshToken',
      reshToken,
      30 * 24 * 60
    );

    setCookie(
      res,
      'accessTokenExpiresAt',
      accessTokenExpiresAt.toString(),
      0,
      false
    );

    return createResponse(
      'SUCCESS',
      'TOKEN_REFRESH_SUCCESS',
      user
    );
  }

  /**
   * 로그아웃
   * @param req 요청 객체
   * @param res 응답 객체
   * @returns 로그아웃 결과
   */
  @ApiOperation({
    summary: '로그아웃',
    description: '사용자 로그아웃을 처리하고 모든 인증 정보를 제거합니다.',
  })
  @ApiOkResponse({
    description: '로그아웃 성공',
    schema: {
      example: {
        error: false,
        code: RESPONSE_CODE.SUCCESS,
        message: MESSAGE_CODE.SIGN_OUT_SUCCESS,
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '로그아웃 실패',
    schema: {
      example: {
        error: true,
        code: RESPONSE_CODE.INTERNAL_SERVER_ERROR,
        message: MESSAGE_CODE.SIGN_OUT_ERROR,
        data: null,
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('signout')
  async signOut(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true, }) res: FastifyReply
  ): Promise<ResponseDto<null>> {
    // 쿠키에서 accessToken을 가져와서 서비스에 전달
    const accessToken = req.cookies['accessToken'];

    // 서비스에서 로그아웃 처리
    const result = await this.authService.signOut(accessToken);

    // 쿠키 정리
    clearCookie(res, 'accessToken');
    clearCookie(res, 'refreshToken');
    clearCookie(res, 'accessTokenExpiresAt');

    return result;
  }

  /**
   * 세션 조회
   * @param req 요청 객체
   * @returns 현재 사용자 정보
   */
  @ApiOperation({
    summary: '세션 조회',
    description: '현재 로그인된 사용자의 세션 정보를 조회합니다.',
  })
  @ApiOkResponse({
    description: '세션 조회 성공',
    schema: {
      example: {
        error: false,
        code: RESPONSE_CODE.SUCCESS,
        message: MESSAGE_CODE.SIGN_IN_SUCCESS,
        data: createExampleUser(),
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '세션 조회 실패',
    schema: {
      example: {
        error: true,
        code: RESPONSE_CODE.UNAUTHORIZED,
        message: MESSAGE_CODE.INVALID_CREDENTIALS,
        data: null,
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('session')
  async getSession(@Req() req: FastifyRequest & { user: JwtPayload }) {
    const authUser = req.user;
    return this.authService.session(authUser.userNo);
  }

  /**
   * 회원탈퇴
   * @param req 요청 객체
   * @param res 응답 객체
   * @returns 회원탈퇴 결과
   */
  @ApiOperation({
    summary: '회원탈퇴',
    description: '현재 로그인된 사용자의 계정을 영구적으로 삭제합니다.',
  })
  @ApiOkResponse({
    description: '회원탈퇴 성공',
    schema: {
      example: {
        error: false,
        code: RESPONSE_CODE.SUCCESS,
        message: MESSAGE_CODE.SIGN_OUT_SUCCESS,
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '회원탈퇴 실패',
    schema: {
      example: {
        error: true,
        code: RESPONSE_CODE.UNAUTHORIZED,
        message: MESSAGE_CODE.INVALID_CREDENTIALS,
        data: null,
      },
    },
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete('withdraw')
  async withdraw(
    @Req() req: FastifyRequest & { user: JwtPayload },
    @Body() withdrawData: WithdrawDto,
    @Res({ passthrough: true, }) res: FastifyReply
  ) {
    const user = req.user;
    const result = await this.authService.withdraw(user.userNo, withdrawData);

    clearCookie(res, 'accessToken');
    clearCookie(res, 'refreshToken');
    clearCookie(res, 'accessTokenExpiresAt');

    return result;
  }

  /**
   * 비밀번호 변경
   * @param req 요청 객체
   * @param changePasswordData 비밀번호 변경 데이터
   * @returns 비밀번호 변경 결과
   */
  @ApiOperation({
    summary: '비밀번호 변경',
    description: '현재 로그인된 사용자의 비밀번호를 변경합니다.',
  })
  @ApiOkResponse({
    description: '비밀번호 변경 성공',
    schema: {
      example: {
        error: false,
        code: RESPONSE_CODE.SUCCESS,
        message: MESSAGE_CODE.PASSWORD_CHANGE_SUCCESS,
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '비밀번호 변경 실패',
    schema: {
      example: {
        error: true,
        code: RESPONSE_CODE.UNAUTHORIZED,
        message: MESSAGE_CODE.INVALID_CREDENTIALS,
        data: null,
      },
    },
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('change-password')
  async changePassword(
    @Req() req: FastifyRequest & { user: JwtPayload },
    @Body() changePasswordData: ChangePasswordDto
  ): Promise<ResponseDto<UserInfoDto>> {
    const user = req.user;
    return this.authService.changePassword(user.userNo, changePasswordData);
  }

  /**
   * 비밀번호 찾기
   * @param forgotPasswordData 비밀번호 찾기 데이터
   * @returns 비밀번호 찾기 결과
   */
  @ApiOperation({
    summary: '비밀번호 찾기',
    description: '이메일로 비밀번호 재설정 링크를 발송합니다.',
  })
  @ApiOkResponse({
    description: '비밀번호 찾기 성공',
    schema: {
      example: {
        error: false,
        code: RESPONSE_CODE.SUCCESS,
        message: MESSAGE_CODE.FORGOT_PASSWORD_SUCCESS,
        data: null,
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordData: ForgotPasswordDto
  ): Promise<ResponseDto<null>> {
    return this.authService.forgotPassword(forgotPasswordData);
  }

  /**
   * 새 비밀번호 설정
   * @param newPasswordData 새 비밀번호 데이터
   * @returns 새 비밀번호 설정 결과
   */
  @ApiOperation({
    summary: '새 비밀번호 설정',
    description: '비밀번호 재설정 토큰을 사용하여 새 비밀번호를 설정합니다.',
  })
  @ApiOkResponse({
    description: '새 비밀번호 설정 성공',
    schema: {
      example: {
        error: false,
        code: RESPONSE_CODE.SUCCESS,
        message: MESSAGE_CODE.PASSWORD_CHANGE_SUCCESS,
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '새 비밀번호 설정 실패',
    schema: {
      example: {
        error: true,
        code: RESPONSE_CODE.UNAUTHORIZED,
        message: MESSAGE_CODE.INVALID_OR_EXPIRED_RESET_TOKEN,
        data: null,
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async newPassword(
    @Body() newPasswordData: ResetPasswordDto
  ): Promise<ResponseDto<UserInfoDto>> {
    return this.authService.newPassword(newPasswordData);
  }
}
