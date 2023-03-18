import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import { UsersService } from '@/users/users.service';
import { UserResDTO } from './dto';
import { CreateUserDTO } from '@/users/dto';
import { UserEntity } from '@/common/entity';

export interface TokenPayload {
  id: number;
  email: string;
  userName: string;
}

@Injectable()
export class AuthService {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly prisma: PrismaService,
    // eslint-disable-next-line no-unused-vars
    private readonly usersService: UsersService,
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
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        userName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      message: '회원가입이 완료되었습니다.',
      user,
    };
  }

  //액세스 토큰 생성
  async createAccessToken(user: UserEntity) {
    const { id, email, userName, } = user;
    const AccessToken = await this.jwtService.signAsync(
      { id, email, userName, },
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
  async createRefreshToken(user: UserEntity) {
    const { id, email, userName, } = user;
    const RefreshToken = await this.jwtService.signAsync(
      { id, email, userName, },
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
  async signOutWithTokenClear() {
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

    const isMatch = await this.compareData(password, user.password);

    if (!isMatch) {
      throw new HttpException(
        {
          message: '비밀번호가 일치하지 않습니다.',
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    delete user.password;
    delete user.status;

    return user;
  }

  // 데이터 암호화
  async hashData(data: string) {
    const hashedData = await bcrypt.hash(data, 10);

    return hashedData;
  }

  // 암호화 데이터 검증
  async compareData(rawData: string, data: string) {
    const res = await bcrypt.compare(rawData, data);

    return res;
  }

  // 리프레시 토큰 검증
  async refreshTokenMatches(id: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, },
      select: {
        id: true,
        userName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        hashedRefreshToken: true,
      },
    });

    const isRefreshTokenMatching = await this.compareData(
      refreshToken,
      user.hashedRefreshToken
    );

    if (isRefreshTokenMatching) {
      delete user.hashedRefreshToken;

      return user;
    }
  }

  // 리프레시 토큰 업데이트
  async updateRefreshToken(id: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);

    await this.prisma.user.update({
      where: { id, },
      data: {
        hashedRefreshToken,
      },
    });
  }

  // 리프레시 토큰 제거
  async deleteRefreshToken(id: number) {
    await this.prisma.user.update({
      where: { id, },
      data: {
        hashedRefreshToken: null,
      },
    });
  }
}
