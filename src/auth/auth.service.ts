import {
  BadRequestException, Injectable, UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { TokenPayload } from './types/token-payload.types';
import { SignUpDto } from './dto/sign-up.dto';
import { Tokens } from './types/tokens.types';
import { UserWithTokens } from './types/user-with-tokens.types';

@Injectable()
export class AuthService {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly prisma: PrismaService,
    // eslint-disable-next-line no-unused-vars
    private readonly jwtService: JwtService,
    // eslint-disable-next-line no-unused-vars
    private readonly configService: ConfigService
  ) {}

  // ==================== 회원가입 ====================
  async signUp(signUpDto: SignUpDto): Promise<User> {
    const { email, userName, password, } = signUpDto;

    const emailCheck = await this.prisma.user.findUnique({
      where: {
        email,
        NOT: {
          status: 'withdrawal',
        },
      },
    });

    const userNameCheck = await this.prisma.user.findUnique({
      where: {
        userName,
        NOT: {
          status: 'withdrawal',
        },
      },
    });

    if (emailCheck && userNameCheck) {
      throw new BadRequestException({
        email: '이미 존재하는 이메일입니다.',
        userName: '이미 존재하는 별명입니다.',
      });
    }

    if (emailCheck) {
      throw new BadRequestException({
        email: '이미 존재하는 이메일입니다.',
      });
    }

    if (userNameCheck) {
      throw new BadRequestException({
        userName: '이미 존재하는 별명입니다.',
      });
    }

    const hashedPassword = await this.hashData(password);

    const user = await this.prisma.user.create({
      data: {
        email,
        userName,
      },
    });

    await this.prisma.userAuth.create({
      data: {
        userId: user.id,
        hashedPassword,
        refreshToken: null,
      },
    });

    return user;
  }

  // ==================== 아이디 패스워드 검증 ====================
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
        NOT: {
          status: 'withdrawal',
        },
      },
    });

    if (!user) {
      throw new BadRequestException([
        '존재하지 않는 사용자입니다.',
      ]);
    }

    const userAuth = await this.prisma.userAuth.findUnique({
      where: {
        userId: user.id,
      },
    });

    const passwordCheck = await this.compareData(
      password,
      userAuth.hashedPassword
    );

    if (passwordCheck) {
      return user;
    } else {
      throw new UnauthorizedException([
        '비밀번호가 일치하지 않습니다.',
      ]);
    }
  }

  // ==================== 로그인 ====================
  async signIn(user: User): Promise<UserWithTokens> {
    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);

    const accessInfo = await this.verifyToken(accessToken, 'accessToken');
    const refreshInfo = await this.verifyToken(refreshToken, 'refreshToken');

    await this.prisma.userAuth.update({
      where: {
        userId: user.id,
      },
      data: {
        refreshToken,
      },
    });

    const tokens: Tokens = {
      accessToken,
      refreshToken,
      accessExp: accessInfo.exp,
      refreshExp: refreshInfo.exp,
    };

    return {
      user,
      tokens,
    };
  }

  // ==================== 로그아웃 ====================
  async signOut(user: User): Promise<void> {
    await this.prisma.userAuth.update({
      where: {
        userId: user.id,
      },
      data: {
        refreshToken: null,
      },
    });
  }

  // ==================== 회원탈퇴 ====================
  async withdrawalUser(user: User): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        status: 'withdrawal',
      },
    });

    await this.prisma.userAuth.update({
      where: {
        userId: user.id,
      },
      data: {
        refreshToken: null,
        hashedPassword: null,
      },
    });
  }

  // ==================== 액세스 토큰 생성 ====================
  async createAccessToken(user: User): Promise<string> {
    const {
      id, email, userName, role,
    } = user;

    const accessToken = await this.jwtService.signAsync(
      {
        sub: id, email, userName, role,
      },
      {
        algorithm: 'HS256',
        expiresIn: Number(this.configService.get('JWT_EXP')),
        secret: this.configService.get('JWT_SECRET'),
      }
    );

    return accessToken;
  }

  // ==================== 리프레시 토큰 생성 ====================
  async createRefreshToken(user: User): Promise<string> {
    const {
      id, email, userName, role,
    } = user;

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: id, email, userName, role,
      },
      {
        algorithm: 'HS256',
        expiresIn: Number(this.configService.get('JWT_REFRESH_EXP')),
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      }
    );

    return refreshToken;
  }

  // ==================== 데이터암호화 ====================
  async hashData(data: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(data, salt);
  }

  // ==================== 데이터검증 ====================
  async compareData(data: string, hashedData: string): Promise<boolean> {
    return bcrypt.compare(data, hashedData);
  }

  // ==================== 토큰검증 ====================
  async verifyToken(token: string, mode: string): Promise<TokenPayload> {
    const secret = mode === 'accessToken'
      ? this.configService.get('JWT_SECRET')
      : this.configService.get('JWT_REFRESH_SECRET');

    return this.jwtService.verify(token, {
      secret,
    }) as TokenPayload;
  }

  // ==================== 토큰 재발급 ====================
  async tokenRefresh(id: number, refreshToken: string): Promise<UserWithTokens> {
    const user = await this.prisma.user.findUnique({
      where: { id, },
    });

    if (!user) {
      throw new UnauthorizedException([
        '인증 정보가 올바르지 않습니다.',
      ]);
    }

    const userAuth = await this.prisma.userAuth.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (refreshToken === userAuth.refreshToken) {
      const accessToken = await this.createAccessToken(user);
      const refreshToken = await this.createRefreshToken(user);

      const accessInfo = await this.verifyToken(accessToken, 'accessToken');
      const refreshInfo = await this.verifyToken(refreshToken, 'refreshToken');

      await this.prisma.userAuth.update({
        where: {
          userId: user.id,
        },
        data: {
          refreshToken,
        },
      });

      const tokens: Tokens = {
        accessToken,
        refreshToken,
        accessExp: accessInfo.exp,
        refreshExp: refreshInfo.exp,
      };

      return {
        user,
        tokens,
      };
    } else {
      throw new UnauthorizedException([
        '인증 정보가 올바르지 않습니다.',
      ]);
    }
  }
}
