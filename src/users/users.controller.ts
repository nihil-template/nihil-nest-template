import {
  Controller, Delete, Get, Param, UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Param('id') id: number) {
    return this.usersService.getUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return this.usersService.deleteUser(id);
  }
}
