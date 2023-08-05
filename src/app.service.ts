import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getInfo() {
    throw new HttpException({
      message: 'Hello World!!',
    }, HttpStatus.OK);
  }
}
