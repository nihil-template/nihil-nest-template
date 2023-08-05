import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';
import { TokenPayload } from '../types/token-payload.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly usersService: UsersService,
    // eslint-disable-next-line no-unused-vars
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // jwtFromRequest: ExtractJwt.fromExtractors([
      //   (request) => {
      //     return request?.cookies?.Authentication;
      //   },
      // ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: TokenPayload) {
    return this.usersService.getUser(payload.sub);
  }
}
