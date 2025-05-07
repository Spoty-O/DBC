import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomError extends HttpException {
  constructor(status: HttpStatus, messages: string[]) {
    super({ status, messages }, status);
  }
}
