import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty({ message: '이메일을 입력해주세요.', })
  @IsEmail({}, { message: '이메일 형식이 아닙니다.', })
  email: string;

  @IsNotEmpty({ message: '별명을 입력해주세요.', })
  @IsString({ message: '별명은 문자열이어야 합니다.', })
  userName: string;

  @IsNotEmpty({ message: '비밀번호를 입력해주세요.', })
  password: string;
}
