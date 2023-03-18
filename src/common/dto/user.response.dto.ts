import { ApiProperty } from '@nestjs/swagger';
import { ResponseDTO } from './response.dto';
import { UserEntity } from '@/common/entity/user.entity';

export class UserResponseDTO extends ResponseDTO {
  @ApiProperty({ description: '유저 정보', })
  user: UserEntity;
}
