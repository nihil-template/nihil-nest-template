import { IsNotEmpty, IsEmail } from 'class-validator';

export class SignUpDTO {
  @IsNotEmpty()
  public userName: string;

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsNotEmpty()
  public password: string;
}
