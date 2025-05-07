import { I18nValidationPipe, I18nValidationPipeOptions } from 'nestjs-i18n';
import { ValidationError, HttpStatus } from '@nestjs/common';
import { CustomError } from 'src/modules/error/custom-error';

export class CustomI18nValidationPipe extends I18nValidationPipe {
  constructor(options?: I18nValidationPipeOptions) {
    super(options);
  }

  public createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      const messages = validationErrors
        .map((error) => Object.values(error.constraints || {}))
        .flat();
      throw new CustomError(HttpStatus.CONFLICT, messages);
    };
  }
}
