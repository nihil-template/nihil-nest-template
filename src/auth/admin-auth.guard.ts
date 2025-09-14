import {
  Injectable,
  ExecutionContext
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { userRoleSchema } from '@repo/drizzle';
import { createError } from '@/utils';

import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AdminAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const result = await super.canActivate(context);

      if (!result) {
        request.errorResponse = createError('UNAUTHORIZED', 'UNAUTHORIZED');
        return true; // Guard를 통과시키되 에러 응답을 설정
      }

      const user = request.user as JwtPayload;

      if (user.userRole !== userRoleSchema.enum.ADMIN) {
        request.errorResponse = createError('FORBIDDEN', 'ADMIN_ONLY');
        return true; // Guard를 통과시키되 에러 응답을 설정
      }

      return true;
    }
    catch {
      request.errorResponse = createError('UNAUTHORIZED', 'UNAUTHORIZED');
      return true; // Guard를 통과시키되 에러 응답을 설정
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRequest<TUser = JwtPayload>(err: unknown, user: TUser, info: unknown): TUser {
    // 에러를 던지지 않고 user만 반환
    // canActivate에서 에러 처리를 담당
    return user;
  }
}
