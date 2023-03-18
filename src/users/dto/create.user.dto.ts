import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty({ message: '이메일을 입력해야합니다.', })
  @IsEmail({}, { message: '이메일 형식이 아닙니다.', })
  @ApiProperty({ description: '이메일', example: 'nihil_ncunia@naver.com', })
  email: string;

  @IsNotEmpty({ message: '이름을 입력해야합니다.', })
  @ApiProperty({ description: '이름', example: 'NIHILncunia', })
  userName: string;

  @IsNotEmpty({ message: '비밀번호를 입력해야합니다.', })
  @ApiProperty({ description: '비밀번호', example: '1234567', })
  password: string;
}
