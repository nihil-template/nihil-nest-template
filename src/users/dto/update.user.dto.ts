import { UserStatus } from '@prisma/client';

export class UpdateUserDTO {
  userName?: string;
  status?: UserStatus;
}
