import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserWithOutPassword } from '@/types/user.types';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passWordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<UserWithOutPassword> {
    const user = await this.authService.validateUser({ email, password, });

    return user;
  }
}
