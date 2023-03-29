import { UserRole, UserStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserTokenEntity } from './user-token.entity';
import { UserAuthEntity } from './user-auth.entity';
import { WithdrawalEntity } from '@/withdrawal/entity/withdrawal.entity';

export class UserEntity {
  @ApiProperty({ type: Number, description: '식별자', })
  id?: number;

  @ApiProperty({ type: String, description: '이메일', })
  email?: string;

  @ApiProperty({ type: String, description: '이름', })
  userName?: string;

  @ApiProperty({ type: 'enum', enum: UserRole, description: '권한', })
  role?: UserRole;

  @ApiProperty({ type: 'enum', enum: UserStatus, description: '상태', })
  status?: UserStatus;

  @ApiProperty({ type: Date, description: '가입일자', })
  created?: Date;

  @ApiProperty({ type: Date, description: '수정일자', })
  updated?: Date;

  @ApiProperty({
    type: () => [ UserAuthEntity, ],
    description: '토큰 정보',
  })
  UserAuth?: [UserAuthEntity];

  @ApiProperty({
    type: () => [ UserTokenEntity, ],
    description: '토큰 정보',
  })
  UserToken?: [UserTokenEntity];

  @ApiProperty({
    type: () => [ WithdrawalEntity, ],
    description: '탈퇴 정보',
  })
  Withdrawal?: [WithdrawalEntity];
}
