import {
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

export class EmptyTextError extends BadRequestException {
  constructor() {
    super({
      code: 'EMPTY_TEXT',
      message: 'text is required and cannot be empty or whitespace-only',
    });
  }
}

export class InvalidResultTypeError extends BadRequestException {
  constructor(public readonly resultType: string) {
    super({
      code: 'INVALID_RESULT_TYPE',
      message: `resultType must be sql, typeorm, or prisma; received "${resultType}"`,
      resultType,
    });
  }
}

export class LlmGenerationError extends BadRequestException {
  constructor(
    message: string,
    public readonly causeDetail?: string,
  ) {
    super({
      code: 'LLM_GENERATION',
      message,
      ...(causeDetail ? { cause: causeDetail } : {}),
    });
  }
}

export class LlmRateLimitError extends HttpException {
  constructor(message: string, public readonly causeDetail?: string) {
    super(
      {
        code: 'LLM_RATE_LIMIT',
        message,
        ...(causeDetail ? { cause: causeDetail } : {}),
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}

export class LlmTimeoutError extends HttpException {
  constructor(message: string, public readonly causeDetail?: string) {
    super(
      {
        code: 'LLM_TIMEOUT',
        message,
        ...(causeDetail ? { cause: causeDetail } : {}),
      },
      HttpStatus.GATEWAY_TIMEOUT,
    );
  }
}

export class LlmProviderUnavailableError extends HttpException {
  constructor(message: string, public readonly causeDetail?: string) {
    super(
      {
        code: 'LLM_PROVIDER_UNAVAILABLE',
        message,
        ...(causeDetail ? { cause: causeDetail } : {}),
      },
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}

export class SchemaValidationError extends BadRequestException {
  constructor(
    message: string,
    public readonly issues: string[] = [],
  ) {
    super({
      code: 'SCHEMA_VALIDATION',
      message,
      issues,
    });
  }
}
