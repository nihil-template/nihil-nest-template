import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDTO {
  @ApiProperty({
    description: '에러 메시지',
    type: String,
    isArray: true,
  })
  message: string[];
}
