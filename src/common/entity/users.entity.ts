import { UserRole, UserStatus } from '@prisma/client';

export class UserWithToken {
  id: number;
  email: string;
  userName: string;
  status: UserStatus;
  role: UserRole;
  created: Date;
  updated: Date;
  accessToken?: string;
  accessExp?: number;
  refreshToken?: string;
  refreshExp?: number;
}
