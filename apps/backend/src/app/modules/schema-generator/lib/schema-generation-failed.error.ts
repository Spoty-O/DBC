import { BadRequestException } from '@nestjs/common';

export interface SchemaGenerationMaxRetriesPayload {
  code: 'SCHEMA_GENERATION_MAX_RETRIES';
  message: string;
  attempts: number;
  maxRetries: number;
  lastIssues: string[];
}

/**
 * Raised when schema JSON could not be produced after parse + dual validation retries.
 */
export class SchemaGenerationMaxRetriesException extends BadRequestException {
  constructor(payload: Omit<SchemaGenerationMaxRetriesPayload, 'code'>) {
    super({
      code: 'SCHEMA_GENERATION_MAX_RETRIES',
      ...payload,
    } as SchemaGenerationMaxRetriesPayload);
  }
}
