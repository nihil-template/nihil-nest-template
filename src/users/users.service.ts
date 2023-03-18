import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UserEntity } from '@/common/entity';
import { CreateUserDTO, UpdateUserDTO } from './dto';

@Injectable()
export class UsersService {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly prisma: PrismaService) { }

  async createUser(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    return this.prisma.user.create({
      data: createUserDTO,
      select: {
        id: true,
        email: true,
        userName: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getUsers(): Promise<UserEntity[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        userName: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getUser(id: number): Promise<UserEntity> {
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

  async updateUser(
    id: number,
    updateUserDTO: UpdateUserDTO
  ): Promise<UserEntity> {
    return this.prisma.user.update({
      where: { id, },
      data: updateUserDTO,
      select: {
        id: true,
        email: true,
        userName: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteUser(id: number): Promise<UserEntity> {
    return this.prisma.user.update({
      where: { id: Number(id), },
      data: { status: 'WITHDRAW', },
      select: {
        id: true,
        email: true,
        userName: true,
        createdAt: true,
        updatedAt: true,
        status: true,
      },
    });
  }
}
