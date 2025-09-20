import { ResponseDto } from '@/dto/response.dto';
import { createError } from '@/utils';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

interface RequestWithError {
  errorResponse?: ResponseDto<null>;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<RequestWithError>();

      try {
        const result = await super.canActivate(context);

        if (!result) {
          // JWT 검증 실패 시 에러 응답 설정
          request.errorResponse = createError('UNAUTHORIZED', 'UNAUTHORIZED');
          return true; // 가드는 통과시키되 에러 응답을 설정
        }

        return true;
      }
      catch {
        // JWT 파싱 에러 등 발생 시
        request.errorResponse = createError('UNAUTHORIZED', 'UNAUTHORIZED');
        return true; // 가드는 통과시키되 에러 응답을 설정
      }
    }
    catch {
      // 최상위 에러 처리
      return true; // 가드는 통과시키되 에러는 인터셉터에서 처리
    }
  }

  // 에러를 던지지 않고 user만 반환
  handleRequest<TUser = any>(err: unknown, user: TUser, _info: unknown): TUser | null {
    // JWT 검증 실패 시 null 반환
    if (err || !user) {
      return null;
    }
    return user;
  }
}
