import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UserWithOutPassword } from '@/types/user.types';

@Injectable()
export class UsersService {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly prisma: PrismaService) { }

  async getUsers(): Promise<UserWithOutPassword[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        userName: true,
      },
    });
  }

  async getUser(id: number) {
    return this.prisma.user.findUnique({
      where: { id: Number(id), },
      select: {
        id: true,
        email: true,
        userName: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteUser(id: number) {
    return this.prisma.user.delete({
      where: { id: Number(id), },
    });
  }
}
