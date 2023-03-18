import { ApiProperty } from '@nestjs/swagger';
import { ResponseDTO } from './response.dto';

export class ErrorResponseDTO extends ResponseDTO {
  @ApiProperty({
    description: '에러 메시지',
    oneOf: [
      { type: 'string', },
      { type: 'string[]', },
    ],
  })
  message: string | string[];
}
