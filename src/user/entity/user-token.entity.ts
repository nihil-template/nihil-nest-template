import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';

export class UserTokenEntity {
  @ApiProperty({ type: Number, description: '식별자', })
  id?: number;

  @ApiProperty({ type: Number, description: '유저 식별자', })
  userId?: number;

  @ApiProperty({ type: String, description: '암호화 토큰', })
  hashedRefreshToken?: string;

  @ApiProperty({ type: () => UserEntity, description: '유저 정보', })
  user?: UserEntity;
}
