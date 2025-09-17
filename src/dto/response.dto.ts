import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';

import {
  listResponseSchema,
  responseSchema
} from '@/endpoints/drizzle/schemas/response.schema';

// 기본 응답 DTO
export class ResponseDto<TData = any> extends createZodDto(responseSchema()) {
  @ApiProperty({
    description: '에러 여부',
    example: false,
  })
  declare error: boolean;

  @ApiProperty({
    description: '응답 메시지',
    example: '요청이 성공적으로 처리되었습니다.',
  })
  declare message: string;

  @ApiProperty({
    description: '응답 코드',
    example: 'SUCCESS',
  })
  declare code: string;

  @ApiProperty({
    description: '응답 데이터',
    example: null,
  })
  declare data: TData;

  @ApiProperty({
    description: '응답일시',
    example: '2024-01-01T00:00:00.000Z',
  })
  declare responseTime?: string;
}

export class ListDto<TData = any> {
  @ApiProperty({
    description: '데이터 목록',
    type: 'array',
    items: { type: 'object', },
  })
  declare list: TData[];

  @ApiProperty({
    description: '전체 개수',
    example: 100,
  })
  declare totalCnt: number;
}

// 리스트 응답 DTO
export class ListResponseDto<TData = any> extends createZodDto(listResponseSchema()) {
  @ApiProperty({
    description: '에러 여부',
    example: false,
  })
  declare error: boolean;

  @ApiProperty({
    description: '응답 메시지',
    example: '요청이 성공적으로 처리되었습니다.',
  })
  declare message: string;

  @ApiProperty({
    description: '응답 코드',
    example: 'SUCCESS',
  })
  declare code: string;

  @ApiProperty({
    description: '리스트 데이터',
    type: 'object',
    properties: {
      list: {
        type: 'array',
        items: { type: 'object', },
        description: '데이터 목록',
      },
      totalCnt: {
        type: 'number',
        description: '전체 개수',
        example: 100,
      },
    },
  })
  declare data: {
    list: TData[];
    totalCnt: number;
  };
}
