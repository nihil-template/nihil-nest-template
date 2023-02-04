import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDTO {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsNotEmpty()
  public password: string;
}
