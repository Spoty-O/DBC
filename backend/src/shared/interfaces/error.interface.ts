import { I18nPath } from 'src/generated/i18n.generated';
import { CustomError } from 'src/modules/error/custom-error';

export interface IErrorItem {
  key: I18nPath;
  args?: Record<string, any>;
}

export interface IErrorService {
  sendError(errorCode: number, errors: IErrorItem[]): Promise<CustomError>;
  badRequest(errors?: IErrorItem[]): Promise<CustomError>;
  unauthorized(errors?: IErrorItem[]): Promise<CustomError>;
  paymentRequired(errors: IErrorItem[]): Promise<CustomError>;
  forbidden(errors?: IErrorItem[]): Promise<CustomError>;
  notFound(errors?: IErrorItem[]): Promise<CustomError>;
  methodNotAllowed(errors: IErrorItem[]): Promise<CustomError>;
  notAcceptable(errors: IErrorItem[]): Promise<CustomError>;
  proxyAuthRequired(errors: IErrorItem[]): Promise<CustomError>;
  requestTimeout(errors: IErrorItem[]): Promise<CustomError>;
  conflict(errors?: IErrorItem[]): Promise<CustomError>;
  payloadToLarge(errors: IErrorItem[]): Promise<CustomError>;
  uriToLong(errors: IErrorItem[]): Promise<CustomError>;
  tooManyRequests(errors: IErrorItem[]): Promise<CustomError>;
  internal(errors?: IErrorItem[]): Promise<CustomError>;
  notImplemented(errors: IErrorItem[]): Promise<CustomError>;
  badGateway(errors: IErrorItem[]): Promise<CustomError>;
  serviceUnavailable(errors: IErrorItem[]): Promise<CustomError>;
  gatewayTimeout(errors: IErrorItem[]): Promise<CustomError>;
}
