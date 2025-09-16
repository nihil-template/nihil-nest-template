import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { changePasswordSchema, createUserSchema, forgotPasswordSchema, resetPasswordSchema, signInSchema, userRoleSchema, withdrawSchema, type UserRoleType } from '@/drizzle/schemas/user.schema';

// 회원가입 DTO
export class CreateUserDto extends createZodDto(createUserSchema.omit({ passwordConfirm: true, })) {
  @ApiProperty({
    description: '사용자 이메일 주소',
    example: 'user@example.com',
  })
  declare emlAddr: string;

  @ApiProperty({
    description: '사용자명 (2-30자)',
    example: '홍길동',
  })
  declare userNm: string;

  @ApiProperty({
    description: '사용자 역할',
    enum: [ userRoleSchema.enum.USER, ],
    example: userRoleSchema.enum.USER,
  })
  declare userRole: UserRoleType;

  @ApiProperty({
    description: '비밀번호 (10-30자, 영문 대소문자/숫자/특수문자 포함)',
    example: 'Password123!',
  })
  declare password: string;
}

// 로그인 DTO
export class SignInDto extends createZodDto(signInSchema) {
  @ApiProperty({
    description: '사용자 이메일 주소 (올바른 이메일 형식)',
    example: 'nihil_ncunia@naver.com',
  })
  declare emlAddr: string;

  @ApiProperty({
    description: '비밀번호 (10-30자, 영문 대소문자/숫자/특수문자 포함)',
    example: 'Password123!',
  })
  declare password: string;
}

export class ForgotPasswordDto extends createZodDto(forgotPasswordSchema) {
  @ApiProperty({
    description: '사용자 이메일 주소 (올바른 이메일 형식)',
    example: 'user@example.com',
  })
  declare emlAddr: string;
}

// 비밀번호 재설정 DTO
export class ResetPasswordDto extends createZodDto(resetPasswordSchema.omit({ confirmPassword: true, })) {
  @ApiProperty({
    description: '사용자 이메일 주소 (올바른 이메일 형식)',
    example: 'user@example.com',
  })
  declare emlAddr: string;

  @ApiProperty({
    description: '리셋 토큰',
    example: 'reset-token',
  })
  declare resetToken: string;

  @ApiProperty({
    description: '새 비밀번호 (10-30자, 영문 대소문자/숫자/특수문자 포함)',
    example: 'NewPassword123!',
  })
  declare newPassword: string;
}

// 비밀번호 변경 DTO
export class ChangePasswordDto extends createZodDto(changePasswordSchema.omit({ confirmPassword: true, })) {
  @ApiProperty({
    description: '현재 비밀번호 (1자 이상)',
    example: 'CurrentPassword123!',
  })
  declare currentPassword: string;

  @ApiProperty({
    description: '새 비밀번호 (10-30자, 영문 대소문자/숫자/특수문자 포함)',
    example: 'NewPassword123!',
  })
  declare newPassword: string;
}

// 회원탈퇴 DTO (비밀번호 확인)
export class WithdrawDto extends createZodDto(withdrawSchema.omit({ passwordConfirm: true, })) {
  @ApiProperty({
    description: '현재 비밀번호 (10-30자, 영문 대소문자/숫자/특수문자 포함)',
    example: 'CurrentPassword123!',
  })
  declare password: string;
}
