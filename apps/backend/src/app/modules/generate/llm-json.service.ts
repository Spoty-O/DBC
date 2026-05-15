import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { GroqSchemaProvider } from '../schema-generator/providers/groq-schema.provider';
import {
  classifyProviderError,
  getProviderErrorMessage,
} from '../schema-generator/lib/llm-provider-error.util';
import { LlmRequestTimeoutError } from '../schema-generator/lib/llm-request-timeout.error';
import { SchemaGenerationMaxRetriesException } from '../schema-generator/lib/schema-generation-failed.error';
import {
  LlmGenerationError,
  LlmProviderUnavailableError,
  LlmRateLimitError,
  LlmTimeoutError,
  SchemaValidationError,
} from './errors/generate.errors';

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
  if (err instanceof LlmRateLimitError) {
    throw err;
  }
  if (err instanceof LlmTimeoutError) {
    throw err;
  }

  if (err instanceof LlmRequestTimeoutError) {
    throw new LlmTimeoutError(err.message);
  }
  if (err instanceof LlmProviderUnavailableError) {
    throw err;
  }

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

  const providerKind = classifyProviderError(err);
  const providerMsg = getProviderErrorMessage(err);

  if (providerKind === 'rate_limit') {
    throw new LlmRateLimitError(
      'LLM provider rate limit exceeded; try again shortly',
      providerMsg,
    );
  }
  if (providerKind === 'timeout') {
    throw new LlmTimeoutError(
      providerMsg || 'LLM provider request timed out',
    );
  }
  if (providerKind === 'unavailable') {
    throw new LlmProviderUnavailableError(
      'LLM provider is temporarily unavailable',
      providerMsg,
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
      lower.includes('not configured')
    ) {
      throw new LlmGenerationError(msg);
    }
    throw new LlmGenerationError(msg);
  }

  if (err instanceof InternalServerErrorException) {
    const msg = extractHttpMessage(err);
    throw new LlmProviderUnavailableError(
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
