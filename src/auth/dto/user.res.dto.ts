import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserEntity } from '@/users/entity/user.entity';

export class UserResDTO {
  @IsNotEmpty()
  @ApiProperty({ type: String, description: '메시지', })
  message: string;

  @IsNotEmpty()
  @ApiProperty({ type: () => UserEntity, description: '유저 정보', })
  user: UserEntity;
}
