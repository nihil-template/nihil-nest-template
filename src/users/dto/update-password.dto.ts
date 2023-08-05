import { IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty({ message: '변경할 비밀번호를 입력해주세요.', })
  password: string;
}
