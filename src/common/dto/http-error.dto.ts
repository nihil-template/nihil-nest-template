import { ApiProperty } from '@nestjs/swagger';

export class HttpErrorDTO {
  @ApiProperty({ type: Number, description: '응답코드', })
  statusCode: number;

  @ApiProperty({ type: String, description: '메시지', })
  message: string;
}
