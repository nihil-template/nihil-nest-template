import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import { UserResDTO } from './dto';
import { CreateUserDTO } from '@/user/dto/create-user.dto';
import { UserEntity } from '@/user/entity/user.entity';
import { IAccessTokenInfo, IRefreshToken } from './types/token-info.types';
import { ITokenOptions } from './types/tokens-info.types';
import { TokenPayload } from './types/token-payload.types';

@Injectable()
export class AuthService {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly prisma: PrismaService,
    // eslint-disable-next-line no-unused-vars
    private readonly jwtService: JwtService,
    // eslint-disable-next-line no-unused-vars
    private readonly configService: ConfigService
  ) { }

  // 회원가입
  async signUp(createUserDTO: CreateUserDTO): Promise<UserResDTO> {
    const { email, userName, password, } = createUserDTO;

    const emailCheck = await this.prisma.user.findUnique({
      where: { email, },
    });

    const userNameCheck = await this.prisma.user.findUnique({
      where: { userName, },
    });

    if (emailCheck && userNameCheck) {
      throw new HttpException(
        {
          message: [
            '이미 존재하는 이메일입니다.',
            '이미 존재하는 닉네임입니다.',
          ],
        },
        HttpStatus.BAD_REQUEST
      );
    }

    if (emailCheck) {
      throw new HttpException(
        {
          message: [ '이미 존재하는 이메일입니다.', ],
        },
        HttpStatus.BAD_REQUEST
      );
    }

    if (userNameCheck) {
      throw new HttpException(
        {
          message: [ '이미 존재하는 닉네임입니다.', ],
        },
        HttpStatus.BAD_REQUEST
      );
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
      },
    });

    await this.prisma.userToken.create({
      data: {
        userId: user.id,
        hashedRefreshToken: null,
      },
    });

    return {
      message: '회원가입이 완료되었습니다.',
      user,
    };
  }

  //액세스 토큰 생성
  async createAccessToken(user: UserEntity): Promise<IAccessTokenInfo> {
    const {
      id, email, userName, role,
    } = user;
    const AccessToken = await this.jwtService.signAsync(
      {
        id, email, userName, role,
      },
      {
        algorithm: 'HS256',
        expiresIn: Number(this.configService.get('JWT_EXP')),
        secret: this.configService.get('JWT_SECRET'),
      }
    );

    return {
      AccessToken,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      maxAge: Number(this.configService.get('JWT_EXP')) * 1000,
    };
  }

  //액세스 토큰 생성
  async createRefreshToken(user: UserEntity): Promise<IRefreshToken> {
    const {
      id, email, userName, role,
    } = user;
    const RefreshToken = await this.jwtService.signAsync(
      {
        id, email, userName, role,
      },
      {
        algorithm: 'HS256',
        expiresIn: Number(this.configService.get('JWT_REFRESH_EXP')),
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      }
    );

    return {
      RefreshToken,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      maxAge: Number(this.configService.get('JWT_REFRESH_EXP')) * 1000,
    };
  }

  // 토큰 정보 제거
  signOutWithTokenClear(): ITokenOptions {
    return {
      accessOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
      refreshOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
    };
  }

  // 로그인시 아이디 비밀번호 체크
  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          message: '존재하지 않는 사용자입니다.',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    const userAuth = await this.prisma.userAuth.findUnique({
      where: { userId: user.id, },
    });

    const isMatch = await this.compareData(password, userAuth.hashedPassword);

    if (!isMatch) {
      throw new HttpException(
        {
          message: '비밀번호가 일치하지 않습니다.',
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    delete user.status;

    return user;
  }

  // 데이터 암호화
  async hashData(data: string): Promise<string> {
    const hashedData = await bcrypt.hash(data, 10);

    return hashedData;
  }

  // 암호화 데이터 검증
  async compareData(rawData: string, data: string): Promise<boolean> {
    const res = await bcrypt.compare(rawData, data);

    return res;
  }

  // 리프레시 토큰 검증
  async refreshTokenMatches(id: number, refreshToken: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id, },
    });

    const userToken = await this.prisma.userToken.findUnique({
      where: { userId: id, },
    });

    const isRefreshTokenMatching = await this.compareData(
      refreshToken,
      userToken.hashedRefreshToken
    );

    if (isRefreshTokenMatching) {
      delete userToken.hashedRefreshToken;

      return user;
    }
  }

  // 리프레시 토큰 업데이트
  async updateRefreshToken(id: number, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await this.hashData(refreshToken);

    await this.prisma.userToken.update({
      where: { userId: id, },
      data: {
        hashedRefreshToken,
      },
    });
  }

  // 리프레시 토큰 제거
  async deleteRefreshToken(id: number): Promise<void> {
    await this.prisma.userToken.update({
      where: { userId: id, },
      data: {
        hashedRefreshToken: null,
      },
    });
  }

  // 토큰 분해
  async verifyToken(token: string): Promise<TokenPayload> {
    const verifiedToken = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get('JWT_SECRET'),
    });

    return verifiedToken;
  }
}
