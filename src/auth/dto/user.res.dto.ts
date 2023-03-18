import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserEntity } from '@/common/entity';

export class UserResDTO {
  @IsNotEmpty()
  @ApiProperty({ description: '메시지', })
  message: string;

  @IsNotEmpty()
  @ApiProperty({ description: '유저 정보', })
  user: UserEntity;
}
