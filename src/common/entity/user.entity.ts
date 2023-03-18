import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';

export class UserEntity {
  @ApiProperty({ description: '식별 아이디', })
  id: number;

  @ApiProperty({ description: '이메일', })
  email: string;

  @ApiProperty({ description: '이름', })
  userName: string;

  @ApiProperty({
    required: false,
    nullable: true,
    description: '비밀번호',
  })
  password?: string | null;

  @ApiProperty({ description: '가입일자', })
  createdAt: Date;

  @ApiProperty({ description: '수정일자', })
  updatedAt: Date;

  @ApiProperty({ description: '상태', })
  status?: UserStatus;

  @ApiProperty({ description: '리프레시 토큰', })
  hashedRefreshToken?: string;
}
