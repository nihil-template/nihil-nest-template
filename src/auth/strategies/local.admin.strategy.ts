import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalAdminStrategy extends PassportStrategy(Strategy, 'local-admin') {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passWordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);

    if (user.role === UserRole.ADMIN) {
      return user;
    } else {
      throw new HttpException({
        message: '관리자 계정이 아닙니다.',
      }, HttpStatus.UNAUTHORIZED);
    }
  }
}
