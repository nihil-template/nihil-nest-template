import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { FastifyRequest } from 'fastify';
import { ConfigService } from '@nestjs/config';
import { UserRoleType } from '@repo/drizzle';

export interface JwtPayload {
  userNo: number;
  emlAddr: string;
  userNm: string;
  userRole: UserRoleType;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // 1. Authorization 헤더에서 Bearer 토큰 추출
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        // 2. 쿠키에서 accessToken 추출
        (request: FastifyRequest): string | null => {
          return request?.cookies?.accessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.access.secret'),
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    return {
      userNo: payload.userNo,
      emlAddr: payload.emlAddr,
      userNm: payload.userNm,
      userRole: payload.userRole,
    };
  }
}
