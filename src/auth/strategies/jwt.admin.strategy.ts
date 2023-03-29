import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '../auth.service';
import { UsersService } from '@/users/users.service';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly usersService: UsersService,
    // eslint-disable-next-line no-unused-vars
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: TokenPayload) {
    const { id, role, } = payload;

    if (role === 'admin') {
      return this.usersService.getUser(id);
    } else {
      throw new HttpException(
        {
          message: '관리자 계정이 아닙니다.',
        },
        HttpStatus.UNAUTHORIZED
      );
    }
  }
}
