import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { JwtPayload } from '@/auth/jwt.strategy';
import { createError, createResponse } from '@/utils';
import { createExampleUser } from '@/utils/createExampleUser';
import { MESSAGE_CODE } from '@/code/message.code';
import { RESPONSE_CODE } from '@/code/response.code';
import { ListDto, ResponseDto } from '@/dto/response.dto';
import { UpdateUserDto, UserInfoDto } from '@/dto/user.dto';
import { cloneDeep } from 'lodash';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  /**
   * 전체 사용자 목록 조회
   * @returns 사용자 목록
   */
  @ApiOperation({
    summary: '👥 전체 사용자 목록 조회',
    description: '웹 애플리케이션의 모든 등록된 사용자 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '사용자 목록 조회 성공',
    schema: {
      example: {
        error: false,
        code: RESPONSE_CODE.SUCCESS,
        message: MESSAGE_CODE.USER_LIST_SUCCESS,
        data: {
          list: [ createExampleUser(), ],
          totalCnt: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '잘못된 요청 데이터',
    schema: {
      example: {
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: MESSAGE_CODE.INVALID_REQUEST,
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '사용자 목록 조회 실패',
    schema: {
      example: {
        error: true,
        code: RESPONSE_CODE.INTERNAL_SERVER_ERROR,
        message: MESSAGE_CODE.USER_LIST_ERROR,
        data: null,
      },
    },
  })
  @ApiQuery({
    name: 'strtRow',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'endRow',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'srchType',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'srchKywd',
    type: String,
    required: false,
  })
  @ApiBearerAuth('JWT-auth')
  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(
    @Query('strtRow') strtRow?: number,
    @Query('endRow') endRow?: number,
    @Query('srchType') srchType?: 'userNm' | 'emlAddr',
    @Query('srchKywd') srchKywd?: string
  ): Promise<ResponseDto<ListDto<UserInfoDto>>> {
    const result = await this.usersService.getUsers(strtRow, endRow, srchType, srchKywd);

    if (!result) {
      return createError('BAD_REQUEST', 'INVALID_REQUEST');
    }

    const listToReturn = cloneDeep(result.list);
    listToReturn.forEach((user) => {
      user.encptPswd = undefined;
      user.reshToken = undefined;
    });

    return createResponse('SUCCESS', 'USER_LIST_SUCCESS', {
      list: listToReturn,
      totalCnt: result.totalCnt,
    });
  }

  /**
   * 특정 사용자 정보 조회 (ID)
   * @param userNo 사용자 ID
   * @returns 사용자 정보
   */
  @ApiOperation({
    summary: '🔍 사용자 상세 정보 조회 (ID)',
    description: '사용자 ID로 특정 사용자의 상세 정보를 조회합니다.',
  })
  @ApiOkResponse({
    description: '사용자 정보 조회 성공',
    schema: {
      example: {
        error: false,
        code: RESPONSE_CODE.SUCCESS,
        message: MESSAGE_CODE.USER_INFO_FOUND,
        data: createExampleUser(),
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '사용자를 찾을 수 없음',
    schema: {
      example: {
        error: true,
        code: RESPONSE_CODE.NOT_FOUND,
        message: MESSAGE_CODE.USER_NOT_FOUND,
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 조회 실패',
    schema: {
      example: {
        error: true,
        code: RESPONSE_CODE.INTERNAL_SERVER_ERROR,
        message: MESSAGE_CODE.USER_INFO_ERROR,
        data: null,
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get(':userNo')
  @HttpCode(HttpStatus.OK)
  async getUserById(
    @Param('userNo') userNo: number
  ): Promise<ResponseDto<UserInfoDto>> {
    const result = await this.usersService.getUserById(userNo);

    if (!result) {
      return createError('NOT_FOUND', 'USER_NOT_FOUND');
    }

    const userToReturn = cloneDeep(result);
    userToReturn.encptPswd = undefined;
    userToReturn.reshToken = undefined;

    return createResponse('SUCCESS', 'USER_INFO_FOUND', userToReturn);
  }

  /**
   * 이메일로 사용자 정보 조회
   * @param emlAddr 사용자 이메일 주소
   * @returns 사용자 정보
   */
  @ApiOperation({
    summary: '📧 이메일로 사용자 검색',
    description: '이메일 주소로 사용자를 검색합니다.',
  })
  @ApiOkResponse({
    description: '사용자 정보 조회 성공',
    schema: {
      example: {
        error: false,
        code: RESPONSE_CODE.SUCCESS,
        message: MESSAGE_CODE.USER_INFO_FOUND,
        data: createExampleUser(),
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '사용자를 찾을 수 없음',
    schema: {
      example: {
        error: true,
        code: RESPONSE_CODE.NOT_FOUND,
        message: MESSAGE_CODE.USER_NOT_FOUND,
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 조회 실패',
    schema: {
      example: {
        error: true,
        code: RESPONSE_CODE.INTERNAL_SERVER_ERROR,
        message: MESSAGE_CODE.USER_INFO_ERROR,
        data: null,
      },
    },
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('email/:emlAddr')
  @HttpCode(HttpStatus.OK)
  async getUserByEmail(
    @Param('emlAddr') emlAddr: string
  ): Promise<ResponseDto<UserInfoDto>> {
    const result = await this.usersService.getUserByEmail(emlAddr);

    if (!result) {
      return createError('NOT_FOUND', 'USER_NOT_FOUND');
    }

    const userToReturn = cloneDeep(result);
    userToReturn.encptPswd = undefined;
    userToReturn.reshToken = undefined;

    return createResponse('SUCCESS', 'USER_INFO_FOUND', userToReturn);
  }

  /**
   * 내 프로필 정보 수정
   * @param req 요청 객체
   * @param updateProfileData 프로필 수정 데이터
   * @returns 수정된 사용자 정보
   */
  @ApiOperation({
    summary: '✏️ 프로필 정보 수정',
    description: '현재 로그인된 사용자의 프로필을 업데이트합니다.',
  })
  @ApiOkResponse({
    description: '프로필 수정 성공',
    schema: {
      example: {
        error: false,
        code: RESPONSE_CODE.SUCCESS,
        message: MESSAGE_CODE.PROFILE_UPDATE_SUCCESS,
        data: createExampleUser(),
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '잘못된 요청 데이터',
    schema: {
      example: {
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: MESSAGE_CODE.INVALID_REQUEST,
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '사용자를 찾을 수 없음',
    schema: {
      example: {
        error: true,
        code: RESPONSE_CODE.NOT_FOUND,
        message: MESSAGE_CODE.USER_NOT_FOUND,
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '사용자명 중복',
    schema: {
      example: {
        error: true,
        code: RESPONSE_CODE.CONFLICT,
        message: MESSAGE_CODE.USER_NAME_EXISTS,
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '프로필 수정 실패',
    schema: {
      example: {
        error: true,
        code: RESPONSE_CODE.INTERNAL_SERVER_ERROR,
        message: MESSAGE_CODE.PROFILE_UPDATE_ERROR,
        data: null,
      },
    },
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Req() req: FastifyRequest & { user: JwtPayload },
    @Body() updateProfileData: UpdateUserDto
  ): Promise<ResponseDto<UserInfoDto>> {
    const authUser = req.user;
    const result = await this.usersService.updateProfile(authUser.userNo, updateProfileData);

    const userToReturn = cloneDeep(result);
    userToReturn.encptPswd = undefined;
    userToReturn.reshToken = undefined;

    if (!result) {
      return createError('NOT_FOUND', 'USER_NOT_FOUND');
    }

    return createResponse('SUCCESS', 'PROFILE_UPDATE_SUCCESS', userToReturn);
  }
}
