import { Module } from '@nestjs/common';
import { AuthModule } from '@/endpoints/auth/auth.module';
import { DrizzleModule } from '@/endpoints/drizzle/drizzle.module';
import { AdminController } from '@/endpoints/admin/admin.controller';
import { AdminService } from '@/endpoints/admin/admin.service';
import { UserRepository } from '@/endpoints/repositories/user.repository';

@Module({
  imports: [ AuthModule, DrizzleModule, ],
  controllers: [ AdminController, ],
  providers: [ AdminService, UserRepository, ],
})
export class AdminModule {}
