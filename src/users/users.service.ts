import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateUserDto, UpdateUserAdminDto, UpdatePasswordDto } from './dto';
import { AuthService } from '@/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly prisma: PrismaService,
    // eslint-disable-next-line no-unused-vars
    private readonly authService: AuthService
  ) { }

  // ==================== 모든 유저 가져오기 ====================
  async getAllUser(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        NOT: {
          status: 'withdrawal',
        },
      },
    });
  }

  // ==================== 개별 유저 가져오기 ====================
  async getUser(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        NOT: {
          status: 'withdrawal',
        },
      },
    });

    if (!user) {
      throw new NotFoundException([
        '존재하지 않는 유저입니다.',
      ]);
    }

    return user;
  }

  // ==================== 유저 정보 변경 ====================
  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  // ==================== 유저 정보 변경(어드민 전용) ====================
  async updateUserWithAdmin(
    id: number,
    updateUserAdminDto: UpdateUserAdminDto
  ): Promise<User> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserAdminDto,
    });
  }

  // ==================== 유저 비밀번호 재설정 ====================
  async updateUserPassword(
    id: number,
    newPasswordDto: UpdatePasswordDto
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    const hashedPassword = await this.authService.hashData(newPasswordDto.password);

    await this.prisma.userAuth.update({
      where: {
        userId: user.id,
      },
      data: {
        hashedPassword,
      },
    });
  }
}
