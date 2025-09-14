declare namespace NodeJS {
  interface ProcessEnv {
    // 서버 기본 설정
    PORT: string; // 실제로는 parseInt()로 숫자 변환 필요
    HOST: string;

    // Swagger API 문서 설정
    SWAGGER_DOCS_NAME: string;
    SWAGGER_DOCS_DESCRIPTION: string;
    SWAGGER_DOCS_VERSION: string;
    SWAGGER_PATH: string;

    // JWT 토큰 설정
    JWT_ACCESS_SECRET: string;
    JWT_ACCESS_EXPIRES_IN: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES_IN: string;

    // Nodemailer 이메일 설정
    NODEMAILER_HOST: string;
    NODEMAILER_PORT: string; // 실제로는 parseInt()로 숫자 변환 필요
    NODEMAILER_SECURE: string; // 실제로는 'true'/'false' 문자열을 boolean으로 변환 필요
    NODEMAILER_USER: string;
    NODEMAILER_PASS: string;

    // 초기 관리자 계정 설정
    INITIAL_ADMIN_EMAIL: string;
    INITIAL_ADMIN_USERNAME: string;
    INITIAL_ADMIN_PASSWORD: string;

    // 데이터베이스 설정
    DATABASE_URL: string;
    DB_HOST: string;
    DB_PORT: string; // 실제로는 parseInt()로 숫자 변환 필요
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;

    // 공통 앱 설정
    APP_NAME: string;
    APP_DESCRIPTION: string;
    APP_VERSION: string;
    APP_URL: string;

    // Node.js 환경
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
