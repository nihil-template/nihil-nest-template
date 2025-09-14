import { userRole, yn } from '@/drizzle/enums';
import { z } from 'zod';

// Drizzle enum을 Zod 스키마로 변환
export const userRoleSchema = z.enum(userRole.enumValues, '사용자 권한은 필수입니다.');
export const ynEnumSchema = z.enum(yn.enumValues, '올바른 값을 입력해주세요.');

// 공통 비밀번호 스키마
export const passwordSchema = z.string()
  .min(10, '비밀번호는 10자 이상이어야 합니다.')
  .max(30, '비밀번호는 30자 이하여야 합니다.')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    '비밀번호는 영문 대소문자, 숫자, 특수문자(@$!%*?&)를 각각 1개 이상 포함해야 합니다.');

// Zod 스키마 정의

export const userInfoSchema = z.object({
  userNo: z.number()
    .int('사용자 번호는 정수여야 합니다.')
    .positive('사용자 번호는 양수여야 합니다.')
    .optional(),
  emlAddr: z.email('올바른 이메일 형식을 입력해주세요.'),
  userNm: z.string()
    .min(2, '사용자명은 2자 이상이어야 합니다.')
    .max(30, '사용자명은 30자 이하여야 합니다.'),
  userRole: userRoleSchema,
  proflImg: z
    .url('올바른 URL 형식을 입력해주세요.')
    .max(1024, '프로필 이미지 URL은 1024자 이하여야 합니다.')
    .nullable().optional(),
  userBiogp: z.string()
    .max(500, '자기소개는 500자 이하여야 합니다.')
    .nullable()
    .optional(),
  encptPswd: z.string()
    .min(1, '암호화된 비밀번호는 필수입니다.')
    .max(255, '암호화된 비밀번호는 255자 이하여야 합니다.'),
  reshToken: z.string()
    .max(500, '리프레시 토큰은 500자 이하여야 합니다.')
    .nullable()
    .optional(),
  useYn: ynEnumSchema
    .default('Y'),
  delYn: ynEnumSchema
    .default('N'),
  lastLgnDt: z.string('올바른 날짜 형식이어야 합니다.')
    .pipe(z.iso.datetime('올바른 ISO 8601 날짜 형식이어야 합니다.'))
    .nullable()
    .optional(),
  crtNo: z.number()
    .int('생성자 번호는 정수여야 합니다.')
    .nullable()
    .optional(),
  crtDt: z.string('생성일시는 올바른 날짜 형식이어야 합니다.')
    .pipe(z.iso.datetime('올바른 ISO 8601 날짜 형식이어야 합니다.'))
    .optional(),
  updtNo: z.number().int('수정자 번호는 정수여야 합니다.')
    .nullable()
    .optional(),
  updtDt: z.string('수정일시는 올바른 날짜 형식이어야 합니다.')
    .pipe(z.iso.datetime('올바른 ISO 8601 날짜 형식이어야 합니다.'))
    .optional(),
  delNo: z.number()
    .int('삭제자 번호는 정수여야 합니다.')
    .nullable()
    .optional(),
  delDt: z.string('삭제일시는 올바른 날짜 형식이어야 합니다.')
    .pipe(z.iso.datetime('올바른 ISO 8601 날짜 형식이어야 합니다.'))
    .nullable()
    .optional(),
  rowNo: z.number()
    .int('행 번호는 정수여야 합니다.')
    .nullable()
    .optional(),
  totalCnt: z.number()
    .int('총 행 수는 정수여야 합니다.')
    .nullable()
    .optional(),
});

// 커스텀 스키마 정의
export const createUserSchema = z.object({
  emlAddr: userInfoSchema.shape.emlAddr,
  userNm: userInfoSchema.shape.userNm,
  userRole: userRoleSchema,
  password: passwordSchema,
  passwordConfirm: passwordSchema,
})
  .refine((data) => data.password === data.passwordConfirm, {
    error: '비밀번호가 일치하지 않습니다.',
    path: [ 'passwordConfirm', ],
  });

export const updateUserSchema = z.object({
  userNm: userInfoSchema.shape.userNm,
  proflImg: userInfoSchema.shape.proflImg,
  userBiogp: userInfoSchema.shape.userBiogp,
}).partial();

export const signInSchema = z.object({
  emlAddr: userInfoSchema.shape.emlAddr,
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

export const forgotPasswordSchema = z.object({
  emlAddr: userInfoSchema.shape.emlAddr,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요.'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
})
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: '비밀번호가 일치하지 않습니다.',
    path: [ 'confirmPassword', ],
  });

export const resetPasswordSchema = z.object({
  resetToken: z.string().min(1, '리셋 토큰을 입력해주세요.'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
})
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: '비밀번호가 일치하지 않습니다.',
    path: [ 'confirmPassword', ],
  });

// 회원탈퇴용 스키마 (비밀번호 확인)
export const withdrawSchema = z.object({
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
  passwordConfirm: z.string().min(1, '비밀번호를 확인해주세요.'),
})
  .refine((data) => data.password === data.passwordConfirm, {
    error: '비밀번호가 일치하지 않습니다.',
    path: [ 'passwordConfirm', ],
  });

// 검색 전용 스키마
export const searchUserSchema = z.object({
  strtRow: z.number()
    .int('시작행은 정수여야 합니다.')
    .min(0, '시작행은 0 이상이어야 합니다.')
    .optional(),
  endRow: z.number()
    .int('끝행은 정수여야 합니다.')
    .min(1, '끝행은 1 이상이어야 합니다.')
    .optional(),
  srchType: z.enum([ 'userNm', 'emlAddr', ], {
    error: '검색 타입은 userNm 또는 emlAddr만 허용됩니다.',
  }).optional(),
  srchKywd: z.string()
    .max(100, '검색 키워드는 100자 이하여야 합니다.')
    .optional(),
}).refine((data) => {
  // 페이지네이션 관련 유효성 검사 (둘 다 있을 때만)
  if (data.strtRow !== undefined && data.endRow !== undefined) {
    return data.endRow > data.strtRow;
  }
  return true;
}, {
  error: '끝행은 시작행보다 커야 합니다.',
  path: [ 'endRow', ],
});

// 모든 항목이 선택값인 스키마
export const partialUserInfoSchema = userInfoSchema.partial();

// 타입 추출
export type UserInfoType = z.infer<typeof userInfoSchema>;
export type CreateUserType = z.infer<typeof createUserSchema>;
export type UpdateUserType = z.infer<typeof updateUserSchema>;
export type SignInType = z.infer<typeof signInSchema>;
export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;
export type ChangePasswordType = z.infer<typeof changePasswordSchema>;
export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;
export type UserRoleType = z.infer<typeof userRoleSchema>;
export type YnType = z.infer<typeof ynEnumSchema>;
export type PartialUserInfoType = z.infer<typeof partialUserInfoSchema>;
export type SearchUserType = z.infer<typeof searchUserSchema>;
export type WithdrawType = z.infer<typeof withdrawSchema>;
