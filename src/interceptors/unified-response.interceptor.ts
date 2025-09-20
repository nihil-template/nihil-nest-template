import { MESSAGE_CODE, RESPONSE_CODE } from '@/code';
import { ResponseDto } from '@/dto/response.dto';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { DateTime } from 'luxon';
import { Observable, map } from 'rxjs';

interface RequestWithError {
  errorResponse?: ResponseDto<null>;
}

@Injectable()
export class UnifiedResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseDto<unknown>> {
    const request = context.switchToHttp().getRequest<RequestWithError>();

    return next.handle().pipe(
      map((data: unknown): ResponseDto<unknown> => {
        try {
          // request에 errorResponse가 설정되어 있으면 해당 에러 반환
          if (request.errorResponse) {
            request.errorResponse.responseTime = DateTime.now().toISO();
            return request.errorResponse;
          }

          // 응답 데이터가 ResponseDto 형태인 경우 responseTime만 설정
          if (data && typeof data === 'object' && 'error' in data) {
            (data as ResponseDto<unknown>).responseTime = DateTime.now().toISO();
            return data as ResponseDto<unknown>;
          }

          // 일반 데이터인 경우는 표준 응답으로 래핑하고 responseTime 설정
          return {
            error: false,
            code: RESPONSE_CODE.SUCCESS,
            message: MESSAGE_CODE.SUCCESS,
            data,
            responseTime: DateTime.now().toISO(),
          } as ResponseDto<unknown>;
        }
        catch {
          // 에러 발생 시 기본 에러 응답 반환
          return {
            error: true,
            code: RESPONSE_CODE.INTERNAL_SERVER_ERROR,
            message: MESSAGE_CODE.INTERNAL_SERVER_ERROR,
            data: null,
            responseTime: DateTime.now().toISO(),
          } as ResponseDto<null>;
        }
      })
    );
  }
}
