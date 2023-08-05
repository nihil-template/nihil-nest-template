import { UseGuards, applyDecorators } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from './role.decorator';
import { JwtAuthGuard, RolesGuard } from '../guard';

export function Auth(roles: UserRole[]) {
  return applyDecorators(
    Roles(roles),
    UseGuards(JwtAuthGuard, RolesGuard)
  );
}
