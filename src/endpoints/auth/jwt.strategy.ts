import { UserRoleType } from '@/endpoints/drizzle/schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { ExtractJwt, Strategy } from 'passport-jwt';

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

  validate(payload: JwtPayload): JwtPayload | null {
    try {
      // JWT 페이로드 검증
      if (!payload || !payload.userNo) {
        return null; // 유효하지 않은 페이로드
      }

      return {
        userNo: payload.userNo,
        emlAddr: payload.emlAddr,
        userNm: payload.userNm,
        userRole: payload.userRole,
      };
    }
    catch {
      return null; // 검증 실패 시 null 반환
    }
  }
}
