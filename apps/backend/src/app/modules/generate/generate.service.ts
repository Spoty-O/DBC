import { Injectable } from '@nestjs/common';
import type { GenerateRequest, GenerateResponse } from 'types';
import {
  InvalidSchemaError,
  UnsupportedModeError,
  UnsupportedOrmError,
  UnsafeIdentifierError,
} from '../database-output/errors/database-output.errors';
import { DatabaseOutputService } from '../database-output/database-output.service';
import {
  EmptyTextError,
  InvalidResultTypeError,
  SchemaValidationError,
} from './errors/generate.errors';
import { LlmJsonService } from './llm-json.service';
import { GenerateRequestZod } from './validation/generate-request.validation';

const RESULT_TYPES = ['sql', 'typeorm', 'prisma'] as const;

@Injectable()
export class GenerateService {
  constructor(
    private readonly llmJson: LlmJsonService,
    private readonly databaseOutput: DatabaseOutputService,
  ) {}

  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    if (
      request.resultType != null &&
      !RESULT_TYPES.includes(request.resultType as (typeof RESULT_TYPES)[number])
    ) {
      throw new InvalidResultTypeError(String(request.resultType));
    }

    const parsed = GenerateRequestZod.safeParse(request);
    if (!parsed.success) {
      this.throwFromZodFailure(request, parsed.error.issues);
    }

    const { text, resultType } = parsed.data;

    const schemaJson = await this.llmJson.generateAndValidateJson(text);

    try {
      const result = this.databaseOutput.generateOutput({
        userPrompt: text,
        schema: schemaJson,
        resultType,
      });

      const schema = result.schema?.trim() ?? '';
      const description = result.description?.trim() ?? '';
      if (!schema) {
        throw new SchemaValidationError('Generated schema text was empty', []);
      }
      if (!description) {
        throw new SchemaValidationError('Description was empty', []);
      }

      return { schema, description };
    } catch (err) {
      this.mapDatabaseOutputErrors(err);
    }
  }

  private throwFromZodFailure(
    request: GenerateRequest,
    issues: import('zod').ZodIssue[],
  ): never {
    const paths = new Set(issues.map((i) => i.path[0]));
    if (paths.has('text')) {
      const tooLong = issues.some((i) =>
        String(i.message).toLowerCase().includes('too long'),
      );
      if (tooLong) {
        throw new SchemaValidationError('text exceeds maximum length', []);
      }
      throw new EmptyTextError();
    }
    if (paths.has('resultType')) {
      throw new InvalidResultTypeError(String(request.resultType ?? ''));
    }
    throw new SchemaValidationError(
      'Invalid request',
      issues.map((i) => `${i.path.join('.') || 'root'}: ${i.message}`),
    );
  }

  private mapDatabaseOutputErrors(err: unknown): never {
    if (err instanceof InvalidSchemaError) {
      throw new SchemaValidationError(err.message, err.issues);
    }
    if (err instanceof UnsupportedModeError) {
      throw new InvalidResultTypeError(err.mode);
    }
    if (err instanceof UnsupportedOrmError) {
      throw new SchemaValidationError(err.message, [
        err.context ?? 'unsupported_orm',
      ]);
    }
    if (err instanceof UnsafeIdentifierError) {
      throw new SchemaValidationError(err.message, [
        `${err.identifier}: ${err.reason}`,
      ]);
    }
    throw err;
  }
}
