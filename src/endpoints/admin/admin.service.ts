import { createError, createResponse } from '@/utils';
import { CreateAdminDto } from '@/dto/admin.dto';
import { ResponseDto } from '@/dto/response.dto';
import { UserInfoDto } from '@/dto/user.dto';
import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class AdminService {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async signUpAdmin(signUpData: CreateAdminDto): Promise<ResponseDto<UserInfoDto>> {
    // 이메일 중복 확인
    const existingUser = await this.userRepository.findByEmail(signUpData.emlAddr);

    if (existingUser) {
      return createError('CONFLICT', 'CONFLICT_EMAIL');
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(signUpData.password, 10);

    // 관리자 계정 생성
    const newUser = await this.userRepository.createAdmin(signUpData, hashedPassword);

    return createResponse(
      'SUCCESS',
      'ADMIN_SIGN_UP_SUCCESS',
      newUser as UserInfoDto
    );
  }
}
