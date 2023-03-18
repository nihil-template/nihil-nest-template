import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';

export class UserWithOutPasswordEntity {
  @ApiProperty({ description: '식별 아이디', })
  id: number;

  @ApiProperty({ description: '이메일', })
  email: string;

  @ApiProperty({ description: '이름', })
  userName: string;

  @ApiProperty({ description: '가입일자', })
  createdAt: Date;

  @ApiProperty({ description: '수정일자', })
  updatedAt: Date;

  @ApiProperty({ description: '상태', nullable: true, })
  status?: UserStatus;
}
