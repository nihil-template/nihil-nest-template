export interface TokenPayload {
  sub: number;
  email: string;
  userName: string;
  role: string;
  iat?: number;
  exp?: number;
  refreshToken?: string;
}
