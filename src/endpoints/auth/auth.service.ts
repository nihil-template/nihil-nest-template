import { UsersService } from '@/endpoints/users/users.service';
import { MailerService } from '@nestjs-modules/mailer';
import {
  Inject,
  Injectable
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { DRIZZLE } from '@/endpoints/drizzle/drizzle.module';
import { schemas } from '@/endpoints/drizzle/schemas';
import { UserRoleType } from '@/endpoints/drizzle/schemas/user.schema';
import { UserRepository } from '@/endpoints/repositories/user.repository';
import { createError, createResponse } from '@/utils';
import { ChangePasswordDto, CreateUserDto, ForgotPasswordDto, ResetPasswordDto, SignInDto, WithdrawDto } from '@/dto/auth.dto';
import { ResponseDto } from '@/dto/response.dto';
import { UserInfoDto } from '@/dto/user.dto';
import bcrypt from 'bcrypt';
import { cloneDeep } from 'lodash';

// JWT Payload 타입 정의
interface JwtPayload {
  userNo: number;
  emlAddr: string;
  userNm: string;
  userRole: UserRoleType;
}

interface ResetPasswordPayload {
  userNo: number;
  purpose: 'reset-password';
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE)
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService
  ) { }

  users = schemas.userInfo;

  /**
   * 회원가입
   * @param signUpData 회원가입 데이터
   * @returns 회원가입 결과
   */
  async signUp(signUpData: CreateUserDto): Promise<ResponseDto<UserInfoDto>> {
    // 이메일 중복 확인
    const existingUser = await this.userRepository.findUser({ emlAddr: signUpData.emlAddr, });

    if (existingUser) {
      return createError('CONFLICT', 'CONFLICT_EMAIL');
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(signUpData.password, 10);

    // 일반 사용자 계정 생성
    const newUser = await this.userRepository.createUserWithRole(signUpData, hashedPassword);

    return createResponse(
      'SUCCESS',
      'SIGN_UP_SUCCESS',
      newUser as UserInfoDto
    );
  }

  /**
   * 로그인
   * @param signInData 로그인 데이터
   * @returns 로그인 결과 데이터 (토큰 정보 포함)
   */
  async signIn(signInData: SignInDto): Promise<{
    user: UserInfoDto;
    acsToken: string;
    reshToken: string;
    accessTokenExpiresAt: number;
  } | {
    error: boolean;
    code: string;
    message: string;
    data: null;
  }> {
    const { emlAddr, password, } = signInData;

    // 사용자 조회
    const user = await this.userRepository.findUser({ emlAddr, });

    if (!user) {
      return createError('UNAUTHORIZED', 'INVALID_CREDENTIALS');
    }

    // 비밀번호 검증
    const isPasswordMatching = await bcrypt.compare(password, user.encptPswd);

    if (!isPasswordMatching) {
      return createError('UNAUTHORIZED', 'INVALID_CREDENTIALS');
    }

    // JWT 페이로드 생성
    const payload: JwtPayload = {
      userNo: user.userNo,
      emlAddr: user.emlAddr,
      userNm: user.userNm,
      userRole: user.userRole,
    };

    // 토큰 생성
    const [ acsToken, reshToken, ] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.access.secret'),
        expiresIn: this.configService.get('jwt.access.expiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.refresh.secret'),
        expiresIn: this.configService.get('jwt.refresh.expiresIn'),
      }),
    ]);

    // 리프레시 토큰과 마지막 로그인 시간 업데이트
    await this.userRepository.updateUser(user.userNo, {
      reshToken,
      lastLgnDt: new Date().toISOString(),
    });

    // AccessToken 만료시간 계산
    const accessTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000).getTime();

    // 응답용 사용자 데이터 준비
    const userToReturn = cloneDeep(user);
    userToReturn.encptPswd = null;
    userToReturn.reshToken = null;

    return {
      user: userToReturn as UserInfoDto,
      acsToken,
      reshToken,
      accessTokenExpiresAt,
    };
  }

  /**
   * 토큰 재발급
   * @param token 리프레시 토큰
   * @returns 재발급된 토큰 정보 또는 에러
   */
  async refresh(token: string): Promise<{
    user: UserInfoDto;
    acsToken: string;
    reshToken: string;
    accessTokenExpiresAt: number;
  } | {
    error: boolean;
    code: string;
    message: string;
    data: null;
  }> {
    if (!token) {
      return createError('UNAUTHORIZED', 'REFRESH_TOKEN_NOT_FOUND');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get('jwt.refresh.secret'),
      });

      const user = await this.usersService.getUserById(payload.userNo);

      if (!user || user.reshToken !== token) {
        return createError('UNAUTHORIZED', 'INVALID_REFRESH_TOKEN');
      }

      const newPayload: JwtPayload = {
        userNo: user.userNo,
        emlAddr: user.emlAddr,
        userNm: user.userNm,
        userRole: user.userRole,
      };
      const [ newAcsToken, newReshToken, ] = await Promise.all([
        this.jwtService.signAsync(newPayload, {
          secret: this.configService.get('jwt.access.secret'),
          expiresIn: this.configService.get('jwt.access.expiresIn'),
        }),
        this.jwtService.signAsync(newPayload, {
          secret: this.configService.get('jwt.refresh.secret'),
          expiresIn: this.configService.get('jwt.refresh.expiresIn'),
        }),
      ]);

      await this.userRepository.updateUser(user.userNo, { reshToken: newReshToken, });

      // AccessToken 만료시간 계산
      const accessTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000).getTime();

      const userToReturn = cloneDeep(user);
      userToReturn.encptPswd = null;
      userToReturn.reshToken = null;
      return { user: userToReturn, acsToken: newAcsToken, reshToken: newReshToken, accessTokenExpiresAt, };
    }
    catch {
      return createError('UNAUTHORIZED', 'INVALID_REFRESH_TOKEN');
    }
  }

  /**
   * 로그아웃
   * @param accessToken 액세스 토큰
   * @returns 로그아웃 결과
   */
  async signOut(accessToken: string): Promise<ResponseDto<null>> {
    try {
      // JWT 토큰에서 사용자 정보 추출
      const decoded = await this.extractUserFromToken(accessToken);

      if (decoded?.userNo) {
        // 리프레시 토큰 삭제
        await this.userRepository.updateUser(decoded.userNo, { reshToken: null, });
      }

      return createResponse('SUCCESS', 'SIGN_OUT_SUCCESS', null);
    }
    catch {
      // 로그아웃은 토큰이 유효하지 않아도 성공으로 처리
      // 사용자가 이미 로그아웃된 상태이거나 토큰이 만료된 경우
      return createResponse('SUCCESS', 'SIGN_OUT_SUCCESS', null);
    }
  }

  /**
   * 세션 조회
   * @param userNo 사용자 No
   * @returns 세션 정보
   */
  async session(userNo: number): Promise<ResponseDto<UserInfoDto>> {
    const user = await this.userRepository.findUser({ userNo, });

    if (!user) {
      return createError('UNAUTHORIZED', 'INVALID_CREDENTIALS');
    }

    const userToReturn = cloneDeep(user);
    userToReturn.encptPswd = null;
    userToReturn.reshToken = null;

    return createResponse(
      'SUCCESS',
      'SIGN_IN_SUCCESS',
      userToReturn as UserInfoDto
    );
  }

  /**
   * 회원탈퇴
   * @param userNo 사용자 No
   * @param withdrawData 회원탈퇴 데이터
   * @returns 회원탈퇴 결과
   */
  async withdraw(userNo: number, withdrawData: WithdrawDto): Promise<ResponseDto<UserInfoDto>> {
    const user = await this.userRepository.findUser({ userNo, });

    if (!user) {
      return createError('UNAUTHORIZED', 'INVALID_CREDENTIALS');
    }

    const isPasswordMatching = await bcrypt.compare(
      withdrawData.password,
      user.encptPswd
    );

    if (!isPasswordMatching) {
      return createError('UNAUTHORIZED', 'INVALID_CREDENTIALS');
    }

    // 하나의 쿼리로 탈퇴 처리 + 조회
    const withdrawnUser = await this.userRepository.updateUser(userNo, {
      useYn: 'N',
      delYn: 'Y',
      delNo: userNo,
    });

    const userToReturn = cloneDeep(withdrawnUser);
    userToReturn.encptPswd = null;
    userToReturn.reshToken = null;

    return createResponse(
      'SUCCESS',
      'WITHDRAW_SUCCESS',
      userToReturn as UserInfoDto
    );
  }

  /**
   * 비밀번호 변경
   * @param userNo 사용자 No
   * @param changePasswordData 비밀번호 변경 데이터
   * @returns 비밀번호 변경 결과
   */
  async changePassword(
    userNo: number,
    changePasswordData: ChangePasswordDto
  ): Promise<ResponseDto<UserInfoDto>> {
    const { currentPassword, newPassword, } = changePasswordData;

    const user = await this.userRepository.findUser({ userNo, });

    if (!user) {
      return createError('UNAUTHORIZED', 'INVALID_CREDENTIALS');
    }

    const isPasswordMatching = await bcrypt.compare(
      currentPassword,
      user.encptPswd
    );

    if (!isPasswordMatching) {
      return createError('UNAUTHORIZED', 'INVALID_CREDENTIALS');
    }

    const newEncptPswd = await bcrypt.hash(newPassword, 10);

    // 하나의 쿼리로 업데이트 + 조회
    const updatedUser = await this.userRepository.updateUser(userNo, { encptPswd: newEncptPswd, });

    const userToReturn = cloneDeep(updatedUser);
    userToReturn.encptPswd = null;
    userToReturn.reshToken = null;

    return createResponse(
      'SUCCESS',
      'PASSWORD_CHANGE_SUCCESS',
      userToReturn as UserInfoDto
    );
  }

  /**
   * 비밀번호 찾기
   * @param forgotPasswordData 비밀번호 찾기 데이터
   * @returns 비밀번호 찾기 결과
   */
  async forgotPassword(
    forgotPasswordData: ForgotPasswordDto
  ): Promise<ResponseDto<null>> {
    const { emlAddr, } = forgotPasswordData;
    const user = await this.userRepository.findUser({ emlAddr, });

    if (!user) {
      return createResponse('SUCCESS', 'FORGOT_PASSWORD_SUCCESS', null);
    }

    const payload: ResetPasswordPayload = { userNo: user.userNo, purpose: 'reset-password', };
    const resetToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('jwt.access.secret'),
      expiresIn: '5m',
    });

    const appBaseUrl = this.configService.get<string>('app.url');
    const validatedUrl = /^https?:\/\//.test(appBaseUrl)
      ? appBaseUrl
      : 'http://localhost:3000';

    const resetLink = `${validatedUrl.replace(/\/$/, '')}/auth/reset-password?token=${resetToken}`;

    try {
      await this.mailerService.sendMail({
        to: user.emlAddr,
        from: `"No Reply" <${this.configService.get('nodemailer.auth.user')}>`,
        subject: `[${this.configService.get('app.name')}] 비밀번호 재설정`,
        text: `비밀번호를 재설정하려면 다음 링크를 클릭하세요: ${resetLink}`,
        html: `
          <h2>비밀번호 재설정</h2>
          <p>비밀번호를 재설정하려면 아래 버튼을 클릭하세요:</p>
          <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">비밀번호 재설정</a>
          <p>링크가 작동하지 않으면 다음 URL을 복사하여 브라우저에 붙여넣으세요:</p>
          <p>${resetLink}</p>
        `,
      });
    }
    catch (error: unknown) {
      if (error instanceof Error) {
        console.error('메일 전송 실패:', { message: error.message, stack: error.stack, });
      }
      else {
        console.error('메일 전송 실패:', error);
      }
    }

    return createResponse('SUCCESS', 'FORGOT_PASSWORD_SUCCESS', null);
  }

  /**
   * 새 비밀번호 설정
   * @param newPasswordData 새 비밀번호 설정 데이터
   * @returns 새 비밀번호 설정 결과
   */
  async newPassword(
    newPasswordData: ResetPasswordDto
  ): Promise<ResponseDto<UserInfoDto>> {
    const { resetToken, newPassword, } = newPasswordData;

    if (!resetToken || !newPassword) {
      return createError('UNAUTHORIZED', 'RESET_TOKEN_AND_PASSWORD_REQUIRED');
    }

    try {
      const payload = await this.jwtService
        .verifyAsync<ResetPasswordPayload>(resetToken, {
          secret: this.configService.get('jwt.access.secret'),
        });

      if (!payload || payload.purpose !== 'reset-password') {
        return createError('UNAUTHORIZED', 'INVALID_TOKEN');
      }

      const encptPswd = await bcrypt.hash(newPassword, 10);

      // 하나의 쿼리로 업데이트 + 조회
      const updatedUser = await this.userRepository.updateUser(payload.userNo, { encptPswd, });

      const userToReturn = cloneDeep(updatedUser);
      userToReturn.encptPswd = null;
      userToReturn.reshToken = null;

      return createResponse(
        'SUCCESS',
        'PASSWORD_CHANGE_SUCCESS',
        userToReturn as UserInfoDto
      );
    }
    catch {
      return createError('UNAUTHORIZED', 'INVALID_OR_EXPIRED_RESET_TOKEN');
    }
  }

  /**
   * JWT 토큰에서 사용자 정보 추출
   * @param token JWT 토큰
   * @returns 사용자 정보 또는 null
   */
  async extractUserFromToken(token: string): Promise<JwtPayload | null> {
    try {
      const payload = await this.jwtService
        .verifyAsync<JwtPayload>(token, {
          secret: this.configService.get('jwt.access.secret'),
        });
      return payload;
    }
    catch {
      return null;
    }
  }
}
