import { z } from 'zod';

const responseSchema = <TData = any>(dataSchema: z.ZodType<TData> = z.any()) => (
  z.object({
    error: z.boolean(),
    code: z.string(),
    message: z.string(),
    data: dataSchema.nullable(),
    responseTime: z.string('응답일시는 올바른 날짜 형식이어야 합니다.')
      .pipe(z.iso.datetime('올바른 ISO 8601 날짜 형식이어야 합니다.'))
      .nullable()
      .optional(),
  })
);

const listResponseSchema = <TData = any>(dataSchema: z.ZodType<TData> = z.any()) => (
  responseSchema(z.object({
    list: z.array(dataSchema),
    totalCnt: z.number(),
  }))
);

type ResponseType<TData = any> = z.infer<ReturnType<typeof responseSchema<TData>>>;
type ListResponseType<TData = any> = z.infer<ReturnType<typeof listResponseSchema<TData>>>;
type ListType<TData = any> = {
  list: TData[];
  totalCnt: number;
};

export {
  responseSchema,
  listResponseSchema
};

export type {
  ResponseType,
  ListResponseType,
  ListType
};
