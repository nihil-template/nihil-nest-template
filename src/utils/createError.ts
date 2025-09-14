import { RESPONSE_CODE, MESSAGE_CODE } from '@repo/message';

export function createError(
  code: keyof typeof RESPONSE_CODE,
  message: keyof typeof MESSAGE_CODE
) {
  return {
    error: true,
    code: RESPONSE_CODE[code] as string,
    message: MESSAGE_CODE[message] as string,
    data: null,
  };
}
