import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  HttpException
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const response = context.switchToHttp().getResponse<FastifyReply>();

    const { method, url, ip, } = request;
    const body = request.body as Record<string, any> | undefined;
    const query = request.query as Record<string, any>;
    const params = request.params as Record<string, any>;
    const headers = request.headers;

    const userAgent = headers['user-agent'] || '';
    const contentType = headers['content-type'] || '';
    const origin = headers['origin'] || '';
    const referer = headers['referer'] || '';

    // Swagger 요청인지 확인
    const isSwaggerRequest = userAgent.includes('Swagger')
      || referer.includes('/api')
      || origin.includes('swagger')
      || headers['x-swagger-login'] === 'true'
      || headers['x-swagger-request'] === 'true'
      || headers['x-request-source'] === 'swagger-ui';

    const startTime = Date.now();

    // 요청 로깅 (Swagger 요청 표시 추가)
    this.logger.log(
      `📨 요청 [${method}] ${url} - IP: ${ip}${isSwaggerRequest
        ? ' 🔧 Swagger'
        : ''}`
        + (Object.keys(query).length > 0
          ? ` | Query: ${JSON.stringify(query)}`
          : '')
        + (Object.keys(params).length > 0
          ? ` | Params: ${JSON.stringify(params)}`
          : '')
        + (method !== 'GET' && body && typeof body === 'object' && Object.keys(body).length > 0
          ? ` | Body: ${JSON.stringify(body)}`
          : '')
        + (contentType
          ? ` | Content-Type: ${contentType}`
          : '')
        + (userAgent
          ? ` | User-Agent: ${userAgent.substring(0, 100)}${userAgent.length > 100
            ? '...'
            : ''}`
          : '')
        + (origin
          ? ` | Origin: ${origin}`
          : '')
    );

    return next.handle().pipe(
      tap({
        next: (responseData) => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          // 응답 로깅 (Swagger 요청 표시 추가)
          this.logger.log(
            `📤 응답 [${method}] ${url} - Status: ${response.statusCode} | Duration: ${duration}ms${isSwaggerRequest
              ? ' 🔧 Swagger'
              : ''}`
              + (responseData && typeof responseData === 'object'
                ? ` | Response: ${JSON.stringify(responseData).substring(0, 500)}${JSON.stringify(responseData).length > 500
                  ? '...'
                  : ''}`
                : ''
              )
          );
        },
        error: (error: unknown) => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          let status = 500;
          let message = '알 수 없는 오류';

          if (error instanceof HttpException) {
            status = error.getStatus();
          }
          else if (error && typeof error === 'object' && 'status' in error) {
            status = (error as { status: number }).status;
          }

          if (error instanceof Error) {
            message = error.message;
          }
          else if (error && typeof error === 'object' && 'message' in error) {
            message = (error as { message: string }).message;
          }

          // 에러 로깅 (Swagger 요청 표시 추가)
          this.logger.error(
            `❌ 에러 [${method}] ${url} - Status: ${status} | Duration: ${duration}ms | Error: ${message}${isSwaggerRequest
              ? ' 🔧 Swagger'
              : ''}`
          );
        },
      })
    );
  }
}
