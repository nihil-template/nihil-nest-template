import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserEntity } from '@/user/entity/user.entity';

@Injectable()
export class UserService {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly prisma: PrismaService) { }

  async createUser(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    return this.prisma.user.create({
      data: createUserDTO,
    });
  }

  async getUsers(): Promise<UserEntity[]> {
    return this.prisma.user.findMany({
      where: {
        NOT: {
          status: 'WITHDRAW',
        },
      },
    });
  }

  async getUser(id: number): Promise<UserEntity> {
    return this.prisma.user.findUnique({
      where: { id: Number(id), },
    });
  }

  async updateUser(
    id: number,
    updateUserDTO: UpdateUserDTO
  ): Promise<UserEntity> {
    return this.prisma.user.update({
      where: { id, },
      data: updateUserDTO,
    });
  }
}
