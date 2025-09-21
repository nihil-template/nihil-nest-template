export const MESSAGE_CODE = {
  // ===== 공통 메시지 =====
  SUCCESS: '요청이 성공적으로 처리되었습니다.',
  ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  UNAUTHORIZED: '권한이 없습니다.',
  FORBIDDEN: '접근이 금지되었습니다.',
  NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
  INVALID_REQUEST: '잘못된 요청입니다.',
  ALREADY_EXISTS: '이미 존재하는 항목입니다.',
  DELETED: '성공적으로 삭제되었습니다.',
  INTERNAL_SERVER_ERROR: '서버 내부 오류가 발생했습니다.',

  // ===== 인증 관련 메시지 =====
  // 성공 메시지
  SIGN_UP_SUCCESS: '회원가입이 완료되었습니다.',
  SIGN_IN_SUCCESS: '로그인되었습니다.',
  SIGN_OUT_SUCCESS: '로그아웃되었습니다.',
  FORGOT_PASSWORD_SUCCESS: '비밀번호 재설정 링크가 이메일로 전송되었습니다.',
  PASSWORD_CHANGE_SUCCESS: '비밀번호가 변경되었습니다.',
  SIGNED_OUT: '로그아웃되었습니다.',
  WITHDRAW_SUCCESS: '회원탈퇴가 완료되었습니다.',
  PASSWORD_CHANGED: '비밀번호가 성공적으로 변경되었습니다.',
  FORGOT_PASSWORD_EMAIL_SENT: '비밀번호 재설정 이메일을 발송했습니다. 5분 안에 확인해주세요.',
  NEW_PASSWORD_SET: '새 비밀번호가 성공적으로 설정되었습니다.',
  TOKEN_REFRESH_SUCCESS: '토큰이 성공적으로 갱신되었습니다.',

  // 에러 메시지
  SIGN_UP_ERROR: '회원가입 중 오류가 발생했습니다.',
  SIGN_IN_ERROR: '로그인 중 오류가 발생했습니다.',
  SIGN_OUT_ERROR: '로그아웃 중 오류가 발생했습니다.',
  WITHDRAW_ERROR: '회원탈퇴 중 오류가 발생했습니다.',
  FORGOT_PASSWORD_ERROR: '비밀번호 재설정 요청 중 오류가 발생했습니다.',
  PASSWORD_CHANGE_ERROR: '비밀번호 변경 중 오류가 발생했습니다.',
  EMAIL_IN_USE: '이미 등록된 이메일입니다.',
  INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다.',
  SESSION_EXPIRED: '세션이 만료되었습니다. 다시 로그인해주세요.',
  AUTH_ALREADY_EXISTS: '이미 존재하는 계정입니다.',
  AUTH_NOT_FOUND: '계정을 찾을 수 없습니다.',
  AUTH_DELETED: '계정이 삭제되었습니다.',
  INVALID_INPUT: '이메일, 사용자명, 비밀번호는 필수 입력 항목입니다.',
  CONFLICT_EMAIL: '이미 가입된 이메일입니다.',
  RESET_TOKEN_AND_PASSWORD_REQUIRED: '리셋 토큰과 새 비밀번호가 필요합니다.',
  INVALID_TOKEN: '유효하지 않은 토큰입니다.',
  INVALID_OR_EXPIRED_RESET_TOKEN: '유효하지 않거나 만료된 리셋 토큰입니다.',
  REFRESH_TOKEN_NOT_FOUND: '리프레시 토큰을 찾을 수 없습니다.',
  INVALID_REFRESH_TOKEN: '유효하지 않은 리프레시 토큰입니다.',
  ADMIN_ONLY: '관리자만 접근할 수 있습니다.',

  // ===== 사용자 관련 메시지 =====
  // 성공 메시지
  USER_CREATE_SUCCESS: '사용자가 생성되었습니다.',
  USER_UPDATE_SUCCESS: '사용자 정보가 수정되었습니다.',
  USER_PASSWORD_CHANGE_SUCCESS: '비밀번호가 변경되었습니다.',
  USER_IMAGE_CHANGE_SUCCESS: '프로필 이미지가 변경되었습니다.',
  USER_LIST_SUCCESS: '사용자 목록을 조회했습니다.',
  USER_FETCH_SUCCESS: '사용자 정보를 조회했습니다.',
  USER_INFO_SUCCESS: '사용자 정보를 성공적으로 조회했습니다.',
  USER_INFO_FOUND: '사용자 정보를 찾았습니다.',
  USER_DELETE_SUCCESS: '사용자가 삭제되었습니다.',
  USER_PROFILE_UPDATED: '프로필이 성공적으로 수정되었습니다.',

  // 에러 메시지
  USER_CREATE_ERROR: '사용자 생성 중 오류가 발생했습니다.',
  USER_UPDATE_ERROR: '사용자 정보 수정 중 오류가 발생했습니다.',
  USER_PASSWORD_CHANGE_ERROR: '비밀번호 변경 중 오류가 발생했습니다.',
  USER_IMAGE_CHANGE_ERROR: '프로필 이미지 변경 중 오류가 발생했습니다.',
  USER_LIST_ERROR: '사용자 목록 조회에 실패했습니다.',
  USER_FETCH_ERROR: '사용자 정보 조회에 실패했습니다.',
  USER_INFO_ERROR: '사용자 정보 조회에 실패했습니다.',
  USER_INFO_NOT_FOUND: '사용자 정보를 찾을 수 없습니다.',
  USER_DELETE_ERROR: '사용자 삭제 중 오류가 발생했습니다.',
  USER_EMAIL_EXISTS: '해당 이메일은 이미 사용 중입니다.',
  USER_NAME_EXISTS: '해당 이름은 이미 존재합니다.',
  USER_NOT_FOUND: '해당 사용자를 찾을 수 없습니다.',
  USER_USER_NOT_FOUND: '사용자를 찾을 수 없습니다.',
  USER_PROFILE_UPDATE_FAILED: '프로필 업데이트에 실패했습니다.',
  USER_PROFILE_VALIDATION_FAILED: '프로필 정보가 올바르지 않습니다.',
  USER_PROFILE_DATA_REQUIRED: '필수 프로필 정보가 누락되었습니다.',
  USER_PROFILE_EMAIL_INVALID: '올바른 이메일 형식이 아닙니다.',
  USER_PROFILE_NAME_REQUIRED: '이름은 필수 입력 항목입니다.',
  USER_PROFILE_NAME_TOO_LONG: '이름은 50자를 초과할 수 없습니다.',
  USER_PROFILE_BIO_TOO_LONG: '자기소개는 500자를 초과할 수 없습니다.',
  USER_PROFILE_IMAGE_INVALID: '올바른 이미지 파일이 아닙니다.',

  // ===== 프로필 관련 메시지 =====
  // 조회 관련
  PROFILE_GET_SUCCESS: '프로필 정보를 조회했습니다.',
  PROFILE_GET_BY_EMAIL_SUCCESS: '이메일로 프로필을 조회했습니다.',
  PROFILE_LIST_SUCCESS: '프로필 목록을 조회했습니다.',
  PROFILE_NOT_FOUND: '해당 프로필을 찾을 수 없습니다.',

  // 생성/수정 관련
  PROFILE_CREATE_SUCCESS: '프로필이 생성되었습니다.',
  PROFILE_UPDATE_SUCCESS: '프로필 정보가 수정되었습니다.',

  // 삭제 관련
  PROFILE_DELETE_SUCCESS: '프로필이 삭제되었습니다.',
  PROFILE_DELETE_MULTIPLE_SUCCESS: '선택한 프로필들이 삭제되었습니다.',

  // 중복 체크 관련
  PROFILE_EMAIL_EXISTS: '해당 이메일은 이미 사용 중입니다.',
  PROFILE_USERNAME_EXISTS: '해당 사용자명은 이미 존재합니다.',

  // 비밀번호 관련
  PROFILE_PASSWORD_CHANGE_SUCCESS: '비밀번호가 변경되었습니다.',
  PROFILE_INVALID_PASSWORD: '현재 비밀번호가 올바르지 않습니다.',

  // 이미지 관련
  PROFILE_IMAGE_CHANGE_SUCCESS: '프로필 이미지가 변경되었습니다.',

  // 에러 메시지
  PROFILE_GET_ERROR: '프로필 정보 조회에 실패했습니다.',
  PROFILE_GET_BY_EMAIL_ERROR: '이메일로 프로필 조회에 실패했습니다.',
  PROFILE_LIST_ERROR: '프로필 목록 조회에 실패했습니다.',
  PROFILE_CREATE_ERROR: '프로필 생성 중 오류가 발생했습니다.',
  PROFILE_UPDATE_ERROR: '프로필 정보 수정 중 오류가 발생했습니다.',
  PROFILE_DELETE_ERROR: '프로필 삭제 중 오류가 발생했습니다.',
  PROFILE_DELETE_MULTIPLE_ERROR: '다중 프로필 삭제 중 오류가 발생했습니다.',
  PROFILE_PASSWORD_CHANGE_ERROR: '비밀번호 변경 중 오류가 발생했습니다.',
  PROFILE_IMAGE_CHANGE_ERROR: '프로필 이미지 변경 중 오류가 발생했습니다.',

  // ===== 관리자 관련 메시지 =====
  // 성공 메시지
  ADMIN_SIGN_UP_SUCCESS: '관리자 계정이 성공적으로 생성되었습니다.',
  ADMIN_SIGN_IN_SUCCESS: '관리자로 로그인되었습니다.',
  ADMIN_SIGN_OUT_SUCCESS: '관리자 로그아웃되었습니다.',
  ADMIN_PASSWORD_CHANGE_SUCCESS: '관리자 비밀번호가 성공적으로 변경되었습니다.',
  ADMIN_PROFILE_UPDATE_SUCCESS: '관리자 프로필이 성공적으로 업데이트되었습니다.',
  ADMIN_LIST_SUCCESS: '관리자 목록을 성공적으로 조회했습니다.',
  ADMIN_FETCH_SUCCESS: '관리자 정보를 성공적으로 조회했습니다.',
  ADMIN_DELETE_SUCCESS: '관리자 계정이 성공적으로 삭제되었습니다.',
  ADMIN_WITHDRAW_SUCCESS: '관리자 계정이 성공적으로 탈퇴되었습니다.',

  // 에러 메시지
  ADMIN_SIGN_UP_ERROR: '관리자 계정 생성 중 오류가 발생했습니다.',
  ADMIN_SIGN_IN_ERROR: '관리자 로그인 중 오류가 발생했습니다.',
  ADMIN_SIGN_OUT_ERROR: '관리자 로그아웃 중 오류가 발생했습니다.',
  ADMIN_PASSWORD_CHANGE_ERROR: '관리자 비밀번호 변경 중 오류가 발생했습니다.',
  ADMIN_PROFILE_UPDATE_ERROR: '관리자 프로필 업데이트 중 오류가 발생했습니다.',
  ADMIN_LIST_ERROR: '관리자 목록 조회 중 오류가 발생했습니다.',
  ADMIN_FETCH_ERROR: '관리자 정보 조회 중 오류가 발생했습니다.',
  ADMIN_DELETE_ERROR: '관리자 계정 삭제 중 오류가 발생했습니다.',
  ADMIN_WITHDRAW_ERROR: '관리자 계정 탈퇴 중 오류가 발생했습니다.',
  ADMIN_EMAIL_EXISTS: '이미 등록된 관리자 이메일입니다.',
  ADMIN_NAME_EXISTS: '이미 사용 중인 관리자명입니다.',
  ADMIN_NOT_FOUND: '관리자를 찾을 수 없습니다.',
  ADMIN_ADMIN_NOT_FOUND: '해당 관리자 계정을 찾을 수 없습니다.',
  ADMIN_INVALID_CREDENTIALS: '관리자 이메일 또는 비밀번호가 올바르지 않습니다.',
  ADMIN_SESSION_EXPIRED: '관리자 세션이 만료되었습니다. 다시 로그인해주세요.',
  ADMIN_UNAUTHORIZED: '관리자 권한이 필요합니다.',
  ADMIN_FORBIDDEN: '관리자만 접근할 수 있는 기능입니다.',
  ADMIN_INVALID_INPUT: '관리자 이메일, 사용자명, 비밀번호는 필수 입력 항목입니다.',
  ADMIN_PROFILE_UPDATE_FAILED: '관리자 프로필 업데이트에 실패했습니다.',
  ADMIN_PROFILE_VALIDATION_FAILED: '관리자 프로필 정보가 유효하지 않습니다.',
  ADMIN_PROFILE_DATA_REQUIRED: '관리자 프로필 데이터가 필요합니다.',
  ADMIN_PROFILE_EMAIL_INVALID: '유효하지 않은 관리자 이메일 형식입니다.',
  ADMIN_PROFILE_NAME_REQUIRED: '관리자명은 필수 입력 항목입니다.',
  ADMIN_PROFILE_NAME_TOO_LONG: '관리자명이 너무 깁니다. (최대 50자)',
  ADMIN_PROFILE_BIO_TOO_LONG: '관리자 소개가 너무 깁니다. (최대 500자)',
  ADMIN_PROFILE_IMAGE_INVALID: '유효하지 않은 관리자 프로필 이미지입니다.',
  ADMIN_PASSWORD_VALIDATION_FAILED: '관리자 비밀번호가 유효하지 않습니다.',
  ADMIN_PASSWORD_MISMATCH: '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.',
  ADMIN_CURRENT_PASSWORD_INCORRECT: '현재 비밀번호가 올바르지 않습니다.',

  // ===== 데이터베이스 관련 메시지 =====
  // 성공/정보 메시지
  DB_CONNECTED: '데이터베이스에 연결되었습니다.',
  DB_DISCONNECTED: '데이터베이스 연결이 종료되었습니다.',
  DB_SEARCH_PATH_SET: '데이터베이스 검색 경로가 설정되었습니다.',

  // 에러 메시지
  DB_CONNECTION_ERROR: '데이터베이스 연결에 실패했습니다.',
  DB_POOL_INIT_ERROR: '데이터베이스 풀 초기화에 실패했습니다.',
  DB_SEARCH_PATH_SET_FAILED: '데이터베이스 검색 경로 설정에 실패했습니다.',
  DB_QUERY_ERROR: '데이터베이스 쿼리 실행 중 오류가 발생했습니다.',
  DRIZZLE_INIT_ERROR: 'Drizzle 초기화 중 오류가 발생했습니다.',
} as const;
