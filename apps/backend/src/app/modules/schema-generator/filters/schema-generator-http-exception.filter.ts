import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import type { Response } from 'express';

@Catch(HttpException)
export class SchemaGeneratorHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const body = exception.getResponse();
    let message: string;
    if (typeof body === 'string') {
      message = body;
    } else if (
      typeof body === 'object' &&
      body !== null &&
      'message' in body
    ) {
      const raw = (body as { message: string | string[] }).message;
      message = Array.isArray(raw) ? raw.join('; ') : String(raw);
    } else {
      message = exception.message;
    }
    response.status(status).json({
      ok: false,
      error: { message },
    });
  }
}
