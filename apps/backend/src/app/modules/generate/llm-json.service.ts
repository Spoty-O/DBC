import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { GroqSchemaProvider } from '../schema-generator/providers/groq-schema.provider';
import { SchemaGenerationMaxRetriesException } from '../schema-generator/lib/schema-generation-failed.error';
import { LlmGenerationError, SchemaValidationError } from './errors/generate.errors';

@Injectable()
export class LlmJsonService {
  constructor(private readonly groqSchema: GroqSchemaProvider) {}

  async generateAndValidateJson(
    prompt: string,
  ): Promise<import('types').GeneratedSchema> {
    try {
      return await this.groqSchema.generateAndValidateJson(prompt);
    } catch (err) {
      return mapLlmOrSchemaError(err);
    }
  }
}

function extractHttpMessage(err: HttpException): string {
  const body = err.getResponse();
  if (typeof body === 'string') {
    return body;
  }
  if (typeof body === 'object' && body !== null && 'message' in body) {
    const raw = (body as { message: string | string[] }).message;
    return Array.isArray(raw) ? raw.join('; ') : String(raw);
  }
  return err.message;
}

function mapLlmOrSchemaError(err: unknown): never {
  if (err instanceof SchemaGenerationMaxRetriesException) {
    const body = err.getResponse() as {
      lastIssues?: string[];
      message?: string;
    };
    throw new SchemaValidationError(
      typeof body?.message === 'string'
        ? body.message
        : 'Schema JSON could not be validated after repair attempts',
      Array.isArray(body?.lastIssues) ? body.lastIssues : [],
    );
  }

  if (err instanceof BadRequestException) {
    const msg = extractHttpMessage(err);
    const lower = msg.toLowerCase();
    if (
      lower.includes('not valid json') ||
      lower.includes('invalid database schema') ||
      lower.includes('schema json')
    ) {
      throw new SchemaValidationError(msg, []);
    }
    if (
      lower.includes('empty response') ||
      lower.includes('not configured') ||
      lower.includes('groq')
    ) {
      throw new LlmGenerationError(msg);
    }
    throw new LlmGenerationError(msg);
  }

  if (err instanceof InternalServerErrorException) {
    const msg = extractHttpMessage(err);
    throw new LlmGenerationError(
      'LLM provider configuration or runtime error',
      msg,
    );
  }

  if (err instanceof HttpException) {
    throw new LlmGenerationError(extractHttpMessage(err));
  }

  if (err instanceof Error) {
    throw new LlmGenerationError(err.message, err.stack);
  }

  throw new LlmGenerationError('LLM generation failed');
}
