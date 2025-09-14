import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DrizzleModule } from '@/drizzle/drizzle.module';
import { UserRepository } from '@/repositories/user.repository';

@Module({
  imports: [ DrizzleModule, ],
  providers: [ UsersService, UserRepository, ],
  controllers: [ UsersController, ],
  exports: [ UsersService, ],
})
export class UsersModule {}
