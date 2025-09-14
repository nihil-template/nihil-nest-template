import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Req, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MESSAGE_CODE, RESPONSE_CODE } from '@repo/message';
import { CreateAdminDto, ResponseDto } from '@repo/dto';

import { AdminAuthGuard } from '@/auth/admin-auth.guard';
import { AdminService } from './admin.service';
import { createExampleUser } from '@/utils/createExampleUser';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({
    summary: '👑 관리자 계정 생성',
    description: '새로운 관리자 계정을 생성합니다. 이 API는 관리자만 호출할 수 있습니다.',
  })
  @ApiResponse({
    status: 200,
    description: '관리자 계정 생성 성공',
    schema: {
      example: {
        error: false,
        code: RESPONSE_CODE.CREATED,
        message: MESSAGE_CODE.ADMIN_SIGN_UP_SUCCESS,
        data: createExampleUser(),
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '접근 권한 없음',
    schema: {
      example: {
        error: true,
        code: RESPONSE_CODE.FORBIDDEN,
        message: MESSAGE_CODE.ADMIN_ONLY,
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '이미 존재하는 이메일',
    schema: {
      example: {
        error: true,
        code: RESPONSE_CODE.CONFLICT,
        message: MESSAGE_CODE.CONFLICT_EMAIL,
        data: null,
      },
    },
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signUp(
    @Body() signUpData: CreateAdminDto,
    @Req() req: Request & { errorResponse?: ResponseDto<null> }
  ) {
    // Guard에서 설정한 에러 응답이 있으면 반환
    if (req.errorResponse) {
      return req.errorResponse;
    }

    return this.adminService.signUpAdmin(signUpData);
  }
}
