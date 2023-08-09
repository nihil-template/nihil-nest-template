import { User } from '@prisma/client';
import { Tokens } from './tokens.types';

export class UserWithTokens {
  user: User;
  tokens: Tokens;
}
