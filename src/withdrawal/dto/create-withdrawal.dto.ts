import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateWithdrawalDto {
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: '유저 식별자',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    type: String,
    description: '탈퇴사유',
    example: '서비스가 개똥같아요!',
  })
  text?: string;
}
