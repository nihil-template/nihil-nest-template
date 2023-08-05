import {
  Body,
  Controller, Get, Param, Patch
} from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { UsersService } from './users.service';
import { UpdatePasswordDto, UpdateUserAdminDto, UpdateUserDto } from './dto';
import { Auth } from '@/auth/decorator';

@Controller('users')
export class UsersController {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly usersService: UsersService
  ) { }

  // ==================== 모든 유저 가져오기 ====================
  @Get('/')
  async getAllUser(): Promise<User[]> {
    return this.usersService.getAllUser();
  }

  // ==================== 개별 유저 가져오기 ====================
  @Get('/:id')
  async getUser(@Param('id') id: number): Promise<User> {
    return this.usersService.getUser(id);
  }

  // ==================== 유저 정보 변경 ====================
  @Patch('/:id')
  @Auth([ UserRole.user, UserRole.admin, ])
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  // ==================== 유저 정보 변경(어드민) ====================
  @Patch('/:id/admin')
  @Auth([ UserRole.admin, ])
  async updateUserWithAdmin(
    @Param('id') id: number,
    @Body() updateUserAdminDto: UpdateUserAdminDto
  ): Promise<User> {
    return this.usersService.updateUserWithAdmin(id, updateUserAdminDto);
  }

  // ==================== 비밀번호 재설정 ====================
  @Patch('/:id/password')
  @Auth([ UserRole.user, UserRole.admin, ])
  async updateUserPassword(
    @Param('id') id: number,
    @Body() updatePasswordDto: UpdatePasswordDto
  ): Promise<void> {
    return this.usersService.updateUserPassword(id, updatePasswordDto);
  }
}
