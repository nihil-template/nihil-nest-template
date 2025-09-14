import { schemas } from '@/drizzle/schemas';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export const DRIZZLE = Symbol('drizzle_connection');

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      useFactory: (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: configService.get('database.url'),
        });
        return drizzle(pool, {
          schema: {
            // schemas에 정의된 스키마 모음을 임포트.
            ...schemas,
          },
        });
      },
      inject: [ ConfigService, ],
    },
  ],
  exports: [ DRIZZLE, ],
})
export class DrizzleModule {}
