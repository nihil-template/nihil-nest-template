import { ApiProperty } from '@nestjs/swagger';

export class HttpErrorDTO {
  @ApiProperty({ description: '응답코드', })
  statusCode: number;

  @ApiProperty({ description: '메시지', })
  message: string;
}
