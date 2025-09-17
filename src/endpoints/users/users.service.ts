import { DRIZZLE } from '@/endpoints/drizzle/drizzle.module';
import { searchUserSchema } from '@/endpoints/drizzle/schemas/user.schema';
import { UserRepository } from '@/endpoints/repositories/user.repository';
import { ListDto } from '@/dto/response.dto';
import { UpdateUserDto, UserInfoDto } from '@/dto/user.dto';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE)
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
      const userData = await this.userRepository.findById(userNo);
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

  async updateProfile(userNo: number, updateProfileData: UpdateUserDto): Promise<UserInfoDto | null> {
    const { userNm, proflImg, userBiogp, } = updateProfileData;

    try {
      // 현재 사용자 정보 조회
      const currentUser = await this.userRepository.findById(userNo);
      if (!currentUser) {
        return null;
      }

      // 사용자명 변경 시 중복 확인
      if (userNm && userNm !== currentUser.userNm) {
        const isExists = await this.userRepository.isUserNameExists(userNm, userNo);
        if (isExists) {
          return null;
        }
      }

      // 프로필 업데이트
      const updatedUser = await this.userRepository.updateProfile(userNo, {
        userNm,
        proflImg,
        userBiogp,
      });

      return updatedUser;
    }
    catch {
      return null;
    }
  }
}
