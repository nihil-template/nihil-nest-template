import {
  Body,
  Controller, Get, Logger, Post, Res,
  UseGuards
} from '@nestjs/common';
import { Response } from 'express';
import { UserWithOutPassword } from '@/types/user.types';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/sign.up.dto';
import { GetUser } from './get.user.decorator';
import { JwtAuthGuard } from './jwt.guard';
import { LocalAuthGuard } from './local.guard';

@Controller('auth')
export class AuthController {
  logger = new Logger('AuthController');
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDTO: SignUpDTO) {
    return this.authService.signUp(signUpDTO);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@GetUser() user: UserWithOutPassword, @Res() res: Response) {
    return this.authService.signIn(user, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('signout')
  async signOut(@Res() res: Response) {
    return this.authService.signOut(res);
  }

  async refresh() {
    return '';
  }
}
