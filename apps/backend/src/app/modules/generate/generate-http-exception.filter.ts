import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import type { Response } from 'express';

@Catch(HttpException)
export class GenerateHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const body = exception.getResponse();

    let message: string;
    let code = 'HTTP_EXCEPTION';

    if (typeof body === 'string') {
      message = body;
    } else if (typeof body === 'object' && body !== null) {
      const o = body as Record<string, unknown>;
      if (typeof o.code === 'string') {
        code = o.code;
      }
      if ('message' in o) {
        const raw = o.message;
        message = Array.isArray(raw)
          ? raw.map(String).join('; ')
          : String(raw ?? exception.message);
      } else {
        message = exception.message;
      }
    } else {
      message = exception.message;
    }

    response.status(status).json({
      ok: false,
      error: { code, message },
    });
  }
}
