import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { PrismaService } from '@/prisma/prisma.service';
import { SignUpDTO } from './dto/sign.up.dto';
import { SignInDTO } from './dto/sign.in.dto';
import { jwtExp, jwtSecret } from '@/utils/constans';
import { UserWithOutPassword } from '@/types/user.types';

@Injectable()
export class AuthService {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly prismaService: PrismaService,
    // eslint-disable-next-line no-unused-vars
    private readonly jwtService: JwtService
  ) { }

  async signUp(signUpDTO: SignUpDTO) {
    const { email, userName, password, } = signUpDTO;

    const emailCheck = await this.prismaService.user.findUnique({
      where: { email, },
    });

    const userNameCheck = await this.prismaService.user.findUnique({
      where: { userName, },
    });

    if (emailCheck) {
      throw new HttpException(
        '이미 존재하는 이메일입니다.',
        HttpStatus.CONFLICT
      );
    }

    if (userNameCheck) {
      throw new HttpException(
        '이미 존재하는 닉네임입니다.',
        HttpStatus.CONFLICT
      );
    }

    const hashedPassword = await this.hashPassword(password);

    return this.prismaService.user.create({
      data: {
        email,
        userName,
        password: hashedPassword,
      },
    });
  }

  async validateUser(signInDTO: SignInDTO) {
    const user = await this.prismaService.user.findUnique({
      where: { email: signInDTO.email, },
    });

    if (!user) {
      throw new HttpException(
        '해당 이메일 정보가 존재하지 않습니다.',
        HttpStatus.NOT_FOUND
      );
    }

    const isMatch = await this.comparePassword(signInDTO.password, user.password);

    if (!isMatch) {
      throw new HttpException(
        '비밀번호가 일치하지 않습니다.',
        HttpStatus.UNAUTHORIZED
      );
    }

    const { password, ...userWithOutPassword } = user;

    return userWithOutPassword;
  }

  async signIn(user: UserWithOutPassword, res: Response) {
    const token = await this.signToken(user.id, user.email);
    const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${jwtExp}`;

    res.setHeader('Set-Cookie', cookie);

    throw new HttpException(
      user,
      HttpStatus.OK
    );
  }

  async signOut(res: Response) {
    const cookie = `Authentication=; HttpOnly; Path=/; Max-Age=0`;

    res.setHeader('Set-Cookie', cookie);

    throw new HttpException(
      '로그아웃 성공.',
      HttpStatus.OK
    );
  }

  async hashPassword(password: string) {
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }

  async comparePassword(password: string, hashedPassword: string) {
    const res = await bcrypt.compare(password, hashedPassword);

    return res;
  }

  async signToken(id: number, email: string) {
    const payload = { id, email, };

    return this.jwtService.signAsync(payload, { secret: jwtSecret, });
  }
}
