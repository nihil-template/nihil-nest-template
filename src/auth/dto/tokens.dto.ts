import { ApiProperty } from '@nestjs/swagger';

export class TokensDTO {
  @ApiProperty({ type: String, description: '액세스 토큰', })
  accessToken: string;

  @ApiProperty({ type: String, description: '리프레시 토큰', })
  refreshToken: string;
}
