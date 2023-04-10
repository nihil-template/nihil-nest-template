import {
  Body,
  Controller, Get, Logger, Param, Patch
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import { HttpErrorDTO } from '@/common/dto';
import { UserEntity } from '@/users/entity/user.entity';
import { Auth } from '@/auth/decorator';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  logger = new Logger('UsersController');

  // eslint-disable-next-line no-unused-vars
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @ApiOkResponse({ description: '성공', type: () => UserEntity, isArray: true, })
  @ApiOperation({
    summary: '모든 유저 조회',
    description: '모든 유저를 조회합니다.',
  })
  async getUsers() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  @ApiOkResponse({ description: '성공', type: () => UserEntity, })
  @ApiOperation({
    summary: '개별 유저 조회',
    description: '개별 유저 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'id를 입력합니다.',
  })
  async getUser(@Param('id') id: number) {
    return this.usersService.getUser(id);
  }

  @Patch(':id')
  @Auth([ UserRole.ADMIN, UserRole.USER, ])
  @ApiOkResponse({ description: '성공', type: () => UserEntity, })
  @ApiUnauthorizedResponse({ description: '인증 실패', type: HttpErrorDTO, })
  @ApiOperation({
    summary: '개별 유저 수정',
    description: '개별 유저 정보를 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'id를 입력합니다.',
  })
  @ApiBody({
    type: UpdateUserDTO,
    description: '수정된 유저 데이터를 전달합니다.',
  })
  async updateUser(@Param('id') id: number, @Body() updateUserDTO: UpdateUserDTO) {
    return this.usersService.updateUser(id, updateUserDTO);
  }
}
