import { DrizzleService } from '@/endpoints/drizzle/drizzle.service';
import { Global, Module } from '@nestjs/common';

export const DRIZZLE = Symbol('drizzle_connection');

@Global()
@Module({
  providers: [
    DrizzleService,
    {
      provide: DRIZZLE,
      useFactory: (drizzleService: DrizzleService) => drizzleService.getDb(),
      inject: [ DrizzleService, ],
    },
  ],
  exports: [ DRIZZLE, DrizzleService, ],
})
export class DrizzleModule {}
