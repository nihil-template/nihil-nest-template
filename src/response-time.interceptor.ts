import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateTime } from 'luxon';

@Injectable()
export class ResponseTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // 응답 데이터가 객체이고 responseTime이 없는 경우에만 추가
        if (data && typeof data === 'object' && !data.responseTime) {
          const responseTime = DateTime.now().toISO();

          return {
            ...data,
            responseTime,
          };
        }

        return data;
      })
    );
  }
}
