export interface TokenPayload {
  id: number;
  email: string;
  userName: string;
  role: string;
  iat?: number;
  exp?: number;
}
