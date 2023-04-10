import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '@/user/entity/user.entity';

export class WithdrawalEntity {
  @ApiProperty({ type: Number, description: '식별자', })
  id?: number;

  @ApiProperty({ type: Number, description: '유저 식별자', })
  userId?: number;

  @ApiProperty({ type: String, description: '탈퇴사유', })
  text?: string;

  @ApiProperty({ type: Date, description: '탈퇴일자', })
  created?: Date;

  @ApiProperty({ type: () => UserEntity, description: '유저', })
  user?: UserEntity;
}
