import { ListDto } from '@/dto/response.dto';
import { UpdateUserDto, UserInfoDto } from '@/dto/user.dto';
import { searchUserSchema } from '@/endpoints/drizzle/schemas/user.schema';
import { UserRepository } from '@/endpoints/repositories/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository
  ) { }

  async getUsers(
    strtRow?: number,
    endRow?: number,
    srchType?: 'userNm' | 'emlAddr',
    srchKywd?: string
  ): Promise<ListDto<UserInfoDto> | null> {
    const searchData = {
      strtRow,
      endRow,
      srchType,
      srchKywd,
    };

    const safeData = searchUserSchema.safeParse(searchData);

    if (!safeData.success) {
      return null;
    }

    // 검색 조건 설정
    const finalSrchType = safeData.data.srchType || 'userNm';
    const finalSrchKywd = safeData.data.srchKywd || '';

    try {
      const result = await this.userRepository.getUsers(
        safeData.data.strtRow,
        safeData.data.endRow,
        finalSrchType,
        finalSrchKywd
      );

      const list = result;
      const totalCnt = result.length > 0
        ? result[0].totalCnt
        : 0;

      return {
        list,
        totalCnt,
      };
    }
    catch {
      return null;
    }
  }

  async getUserById(userNo: number): Promise<UserInfoDto | null> {
    try {
      const userData = await this.userRepository.findByUserNo(userNo);
      return userData;
    }
    catch {
      return null;
    }
  }

  async getUserByEmail(emlAddr: string): Promise<UserInfoDto | null> {
    try {
      const userData = await this.userRepository.findByEmail(emlAddr);
      return userData;
    }
    catch {
      return null;
    }
  }

  async updateProfile(userNo: number, updateProfileData: UpdateUserDto): Promise<{
    success: boolean;
    data?: UserInfoDto;
    errorType?: 'NOT_FOUND' | 'CONFLICT' | 'INTERNAL_SERVER_ERROR';
  }> {
    const { userNm, proflImg, userBiogp, } = updateProfileData;

    try {
      // 현재 사용자 정보 조회
      const currentUser = await this.userRepository.findByUserNo(userNo);

      if (!currentUser) {
        return { success: false, errorType: 'NOT_FOUND', };
      }

      // 사용자명 변경 시 중복 확인
      if (userNm) {
        // 1. 이름으로 사용자 찾기
        const existingUser = await this.userRepository.findByUserName(userNm);

        if (existingUser) {
          // 2. 찾은 사용자의 userNo와 현재 userNo 비교
          if (existingUser.userNo !== userNo) {
            return { success: false, errorType: 'CONFLICT', };
          }
          // 3. 같은 userNo면 이름 변경 안한 것 (패스)
        }
        // 4. 찾은 사용자가 없으면 새 이름 (사용 가능)
      }

      // 프로필 업데이트
      const updatedUser = await this.userRepository.updateProfile(userNo, {
        userNm,
        proflImg,
        userBiogp,
      });

      return { success: true, data: updatedUser, };
    }
    catch {
      return { success: false, errorType: 'INTERNAL_SERVER_ERROR', };
    }
  }
}
