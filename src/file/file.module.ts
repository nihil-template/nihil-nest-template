import { Global, Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';

@Global()
@Module({
  providers: [ FileService, ],
  controllers: [ FileController, ],
  exports: [ FileService, ],
})
export class FileModule {}
