import { MESSAGE_CODE } from '@/code/message.code';
import { RESPONSE_CODE } from '@/code/response.code';

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
