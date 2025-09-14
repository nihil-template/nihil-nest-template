import { RESPONSE_CODE, MESSAGE_CODE } from '@repo/message';

export function createResponse<TData = any>(
  code: keyof typeof RESPONSE_CODE,
  message: keyof typeof MESSAGE_CODE,
  data: TData
) {
  return {
    error: false,
    code: RESPONSE_CODE[code] as string,
    message: MESSAGE_CODE[message] as string,
    data,
  };
}
