import { HttpStatus, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nPath } from 'src/generated/i18n.generated';
import { CustomError } from './custom-error';

interface IErrorItem {
  key: I18nPath;
  args?: Record<string, any>;
}

@Injectable()
export class ErrorService {
  constructor(private readonly i18n: I18nService) {}

  async sendError(errorCode: number, errors: IErrorItem[]) {
    console.log({ errorCode, errors });
    const messages = await Promise.all(
      errors.map(async (error) => {
        const message = (await this.i18n.translate(error.key)) as string;
        return message;
      }),
    );
    console.log(messages);
    return new CustomError(errorCode, messages);
  }

  async badRequest(errors: IErrorItem[] = [{ key: 'errors.badRequest' }]) {
    return await this.sendError(HttpStatus.BAD_REQUEST, errors);
  }

  async unauthorized(errors: IErrorItem[] = [{ key: 'errors.unauthorized' }]) {
    return await this.sendError(HttpStatus.UNAUTHORIZED, errors);
  }

  async paymentRequired(errors: IErrorItem[]) {
    return await this.sendError(HttpStatus.PAYMENT_REQUIRED, errors);
  }

  async forbidden(errors: IErrorItem[] = [{ key: 'errors.forbidden' }]) {
    return await this.sendError(HttpStatus.FORBIDDEN, errors);
  }

  async notFound(errors: IErrorItem[] = [{ key: 'errors.notFound' }]) {
    return await this.sendError(HttpStatus.NOT_FOUND, errors);
  }

  async methodNotAllowed(errors: IErrorItem[]) {
    return await this.sendError(HttpStatus.METHOD_NOT_ALLOWED, errors);
  }

  async notAcceptable(errors: IErrorItem[]) {
    return await this.sendError(HttpStatus.NOT_ACCEPTABLE, errors);
  }

  async proxyAuthRequired(errors: IErrorItem[]) {
    return await this.sendError(
      HttpStatus.PROXY_AUTHENTICATION_REQUIRED,
      errors,
    );
  }

  async requestTimeout(errors: IErrorItem[]) {
    return await this.sendError(HttpStatus.REQUEST_TIMEOUT, errors);
  }

  async conflict(errors: IErrorItem[] = [{ key: 'errors.conflict' }]) {
    return await this.sendError(HttpStatus.CONFLICT, errors);
  }

  async payloadToLarge(errors: IErrorItem[]) {
    return await this.sendError(HttpStatus.PAYLOAD_TOO_LARGE, errors);
  }

  async uriToLong(errors: IErrorItem[]) {
    return await this.sendError(HttpStatus.URI_TOO_LONG, errors);
  }

  async tooManyRequests(errors: IErrorItem[]) {
    return await this.sendError(HttpStatus.TOO_MANY_REQUESTS, errors);
  }

  async internal(errors: IErrorItem[] = [{ key: 'errors.internal' }]) {
    return await this.sendError(HttpStatus.INTERNAL_SERVER_ERROR, errors);
  }

  async notImplemented(errors: IErrorItem[]) {
    return await this.sendError(HttpStatus.NOT_IMPLEMENTED, errors);
  }

  async badGateway(errors: IErrorItem[]) {
    return await this.sendError(HttpStatus.BAD_GATEWAY, errors);
  }

  async serviceUnavailable(errors: IErrorItem[]) {
    return await this.sendError(HttpStatus.SERVICE_UNAVAILABLE, errors);
  }

  async gatewayTimeout(errors: IErrorItem[]) {
    return await this.sendError(HttpStatus.GATEWAY_TIMEOUT, errors);
  }
}
