import { BadRequestException } from '@nestjs/common';

export class InvalidSchemaError extends BadRequestException {
  constructor(
    message: string,
    public readonly issues: string[] = [],
  ) {
    super({
      code: 'INVALID_SCHEMA',
      message,
      issues,
    });
  }
}

export class UnsupportedModeError extends BadRequestException {
  constructor(public readonly mode: string) {
    super({
      code: 'UNSUPPORTED_MODE',
      message: `Unsupported output mode: ${mode}`,
      mode,
    });
  }
}

export class UnsupportedOrmError extends BadRequestException {
  constructor(message: string, public readonly context?: string) {
    super({
      code: 'UNSUPPORTED_ORM',
      message,
      context,
    });
  }
}

export class UnsafeIdentifierError extends BadRequestException {
  constructor(
    public readonly identifier: string,
    public readonly reason: string,
  ) {
    super({
      code: 'UNSAFE_IDENTIFIER',
      message: `Unsafe identifier "${identifier}": ${reason}`,
      identifier,
      reason,
    });
  }
}
