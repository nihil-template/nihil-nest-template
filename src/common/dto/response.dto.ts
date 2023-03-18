import { ApiProperty } from '@nestjs/swagger';

export class ResponseDTO {
  @ApiProperty({ description: '응답 성공 여부', })
  sign: string;
}
