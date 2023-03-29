import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@prisma/client';
import { IsEmpty } from 'class-validator';

export class UpdateUserDTO {
  @IsEmpty()
  @ApiProperty({
    type: String,
    description: '이름',
    nullable: true,
    required: false,
  })
  userName?: string;

  @IsEmpty()
  @ApiProperty({
    type: 'enum',
    enum: UserStatus,
    description: '상태',
    nullable: true,
    required: false,
  })
  status?: UserStatus;

  @IsEmpty()
  @ApiProperty({
    type: 'enum',
    enum: UserRole,
    description: '권한',
    nullable: true,
    required: false,
  })
  role?: UserRole;
}
