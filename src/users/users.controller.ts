import {
  Body,
  Controller, Get, Logger, Param, Patch, Put, UseGuards
} from '@nestjs/common';
import {
  ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@/auth/guards';
import { UpdateUserDTO } from './dto';
import { UserEntity } from '@/common/entity';
import { HttpErrorDTO } from '@/common/dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  logger = new Logger('UsersController');

  // eslint-disable-next-line no-unused-vars
  constructor(private readonly usersService: UsersService) { }

  @ApiOkResponse({ description: '성공', type: UserEntity, isArray: true, })
  @ApiOperation({
    summary: '모든 유저 조회',
    description: '모든 유저를 조회합니다.',
  })
  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }

  @ApiOkResponse({ description: '성공', type: UserEntity, })
  @ApiOperation({
    summary: '개별 유저 조회',
    description: '개별 유저 정보를 조회합니다.',
  })
  @Get(':id')
  async getUser(@Param('id') id: number) {
    return this.usersService.getUser(id);
  }

  @ApiOkResponse({ description: '성공', type: UserEntity, })
  @ApiUnauthorizedResponse({ description: '인증 실패', type: HttpErrorDTO, })
  @ApiOperation({
    summary: '개별 유저 수정',
    description: '개별 유저 정보를 수정합니다.',
  })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() updateUserDTO: UpdateUserDTO) {
    return this.usersService.updateUser(id, updateUserDTO);
  }

  @ApiOkResponse({ description: '성공', type: UserEntity, })
  @ApiUnauthorizedResponse({ description: '인증 실패', type: HttpErrorDTO, })
  @ApiOperation({
    summary: '개별 유저 탈퇴처리',
    description: '유저를 탈퇴처리 합니다. (상태변경).',
  })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async deleteUser(@Param('id') id: number) {
    return this.usersService.deleteUser(id);
  }
}
