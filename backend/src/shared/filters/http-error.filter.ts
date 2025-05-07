import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nValidationException } from 'nestjs-i18n';
import { CustomError } from 'src/modules/error/custom-error';

@Injectable()
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let messages: string[] = ['Internal server error'];

    if (exception instanceof CustomError) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;
      messages = exceptionResponse.messages || ['An error occurred'];
    } else if (exception instanceof I18nValidationException) {
      status = exception.getStatus();
      const errors = exception.errors;
      messages = [];

      for (const error of errors) {
        for (const constraint of Object.values(error.constraints || {})) {
          const [key, argsString] = constraint.split('|');
          const args = argsString ? JSON.parse(argsString) : {};
          const message = await this.i18n.translate(key as string, {
            lang: ctx.getRequest().query.lang || 'en',
            args: args,
          });
          messages.push(message as string);
        }
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      if (typeof exceptionResponse === 'string') {
        messages = [exceptionResponse];
      } else if (Array.isArray(exceptionResponse.message)) {
        messages = exceptionResponse.message;
      } else if (Array.isArray(exceptionResponse.messages)) {
        messages = exceptionResponse.messages;
      } else if (exceptionResponse.message) {
        messages = [exceptionResponse.message];
      } else {
        messages = [exception.message];
      }
    } else if (exception instanceof Error) {
      messages = [exception.message];
    }

    if (status === HttpStatus.BAD_REQUEST) {
      status = HttpStatus.CONFLICT;
    }
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error('Internal server error', exception);
    }
    response.status(status).json({
      status,
      messages,
    });
  }
}
