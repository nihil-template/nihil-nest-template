import {
  Body,
  Controller, Delete, Get, Logger, Param, Put, UseGuards
} from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@/auth/guards';
import { UpdateUserDTO } from './dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  logger = new Logger('UsersController');

  // eslint-disable-next-line no-unused-vars
  constructor(private readonly usersService: UsersService) { }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
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
  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() updateUserDTO: UpdateUserDTO) {
    return this.usersService.updateUser(id, updateUserDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return this.usersService.deleteUser(id);
  }
}
