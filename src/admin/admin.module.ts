import { Module } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { DrizzleModule } from '@/drizzle/drizzle.module';
import { AdminController } from '@/admin/admin.controller';
import { AdminService } from '@/admin/admin.service';
import { UserRepository } from '@/repositories/user.repository';

@Module({
  imports: [ AuthModule, DrizzleModule, ],
  controllers: [ AdminController, ],
  providers: [ AdminService, UserRepository, ],
})
export class AdminModule {}
