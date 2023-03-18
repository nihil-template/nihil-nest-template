import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';

export class UpdateUserDTO {
  @ApiProperty({ description: '이름', nullable: true, })
  userName?: string;

  @ApiProperty({
    description: '상태',
    nullable: true,
    oneOf: [
      { type: 'string', default: 'ACTIVE', },
      { type: 'string', default: 'INACTIVE', },
      { type: 'string', default: 'WITHDRAW', },
    ],
  })
  status?: UserStatus;
}
