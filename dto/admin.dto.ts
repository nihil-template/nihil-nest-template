import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { createUserSchema, userRoleSchema, type UserRoleType } from '@/drizzle/schemas/user.schema';

// 관리자 회원가입 DTO
export class CreateAdminDto extends createZodDto(createUserSchema.omit({ passwordConfirm: true, })) {
  @ApiProperty({
    description: '관리자 이메일 주소',
    example: 'admin@example.com',
  })
  declare emlAddr: string;

  @ApiProperty({
    description: '관리자명 (2자 이상)',
    example: '관리자',
  })
  declare userNm: string;

  @ApiProperty({
    description: '관리자 역할',
    enum: [ userRoleSchema.enum.ADMIN, ],
    example: userRoleSchema.enum.ADMIN,
  })
  declare userRole: UserRoleType;

  @ApiProperty({
    description: '비밀번호 (10-30자, 영문 대소문자/숫자/특수문자 포함)',
    example: 'Password123!',
  })
  declare password: string;
}
