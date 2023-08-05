import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { Observable } from 'rxjs';
import { UserWithToken } from '@/common/entity/users.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserWithToken;

    if (roles.includes(UserRole.user)) {
      return true;
    }

    return roles.includes(user.role);
  }
}
