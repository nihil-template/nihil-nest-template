import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { UserEntity } from '@/user/entity/user.entity';

export class UserResDTO {
  @IsNotEmpty()
  @ApiProperty({ type: String, description: '메시지', })
  message: string;

  @IsNotEmpty()
  @ApiProperty({ type: () => UserEntity, description: '유저 정보', })
  user: UserEntity;

  @IsOptional()
  @ApiProperty({ type: Number, description: '토큰 유효기간', })
  tokenExp?: number;
}
