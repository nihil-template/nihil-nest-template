import { UserRole, UserStatus } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class UpdateUserAdminDto {
  @IsOptional()
  userName?: string;

  @IsOptional()
  role?: UserRole;

  @IsOptional()
  status?: UserStatus;
}
