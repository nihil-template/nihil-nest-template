import { ApiProperty } from '@nestjs/swagger';

import {
  userInfoSchema,
  updateUserSchema,
  searchUserSchema,
  type UserRoleType,
  type YnType
} from '@/drizzle/schemas/user.schema';
import { Exclude } from 'class-transformer';
import { createZodDto } from 'nestjs-zod';

// 사용자 조회 DTO
export class UserInfoDto extends createZodDto(userInfoSchema.partial()) {
  @ApiProperty({
    description: '사용자 번호',
    example: 1,
    required: false,
  })
  declare userNo?: number;

  @ApiProperty({
    description: '사용자 이메일 주소 (올바른 이메일 형식)',
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
    enum: [ 'USER', 'ADMIN', ],
    example: 'USER',
  })
  declare userRole: UserRoleType;

  @ApiProperty({
    description: '사용 여부',
    enum: [ 'Y', 'N', ],
    example: 'Y',
  })
  declare useYn: YnType;

  @ApiProperty({
    description: '삭제 여부',
    enum: [ 'Y', 'N', ],
    example: 'N',
  })
  declare delYn: YnType;

  @Exclude({ toPlainOnly: true, })
  @ApiProperty({
    description: '암호화된 비밀번호 (8-255자, 영문/숫자/특수문자 포함)',
    example: 'hashedPassword123!',
  })
  declare encptPswd: string;

  @ApiProperty({
    description: '사용자 자기소개 (500자 이하)',
    example: '안녕하세요! 개발자입니다.',
    required: false,
  })
  declare userBiogp?: string | null;

  @ApiProperty({
    description: '프로필 이미지 URL (올바른 URL 형식)',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  declare proflImg?: string | null;

  @Exclude({ toPlainOnly: true, })
  @ApiProperty({
    description: '리프레시 토큰',
    example: 'refresh_token_here',
    required: false,
  })
  declare reshToken?: string | null;

  @ApiProperty({
    description: '마지막 로그인 날짜',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  declare lastLgnDt?: string | null;

  @ApiProperty({
    description: '생성자 번호',
    example: 1,
    required: false,
  })
  declare crtNo?: number | null;

  @ApiProperty({
    description: '생성 날짜',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  declare crtDt?: string;

  @ApiProperty({
    description: '수정자 번호',
    example: 1,
    required: false,
  })
  declare updtNo?: number | null;

  @ApiProperty({
    description: '수정 날짜',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  declare updtDt?: string;

  @ApiProperty({
    description: '삭제자 번호',
    example: 1,
    required: false,
  })
  declare delNo?: number | null;

  @ApiProperty({
    description: '삭제 날짜',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  declare delDt?: string | null;
}

// 사용자 프로필 업데이트 DTO
export class UpdateUserDto extends createZodDto(updateUserSchema) {
  @ApiProperty({
    description: '사용자명 (2-30자)',
    example: '홍길동',
    required: false,
  })
  declare userNm?: string;

  @ApiProperty({
    description: '프로필 이미지 URL (올바른 URL 형식)',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  declare proflImg?: string;

  @ApiProperty({
    description: '사용자 자기소개 (500자 이하)',
    example: '안녕하세요! 개발자입니다.',
    required: false,
  })
  declare userBiogp?: string;
}

// 사용자 검색 DTO
export class SearchUserDto extends createZodDto(searchUserSchema) {
  @ApiProperty({
    description: '시작 행 번호 (SQL OFFSET)',
    example: 0,
    required: false,
  })
  declare strtRow?: number;

  @ApiProperty({
    description: '끝 행 번호 (SQL LIMIT)',
    example: 10,
    required: false,
  })
  declare endRow?: number;

  @ApiProperty({
    description: '검색 타입 (emlAddr, userNm 중 하나)',
    example: 'userNm',
    required: false,
  })
  declare srchType?: 'emlAddr' | 'userNm';

  @ApiProperty({
    description: '검색 키워드 (2-100자)',
    example: '홍길동',
    required: false,
  })
  declare srchKywd?: string;
}
