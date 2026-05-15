import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import Groq from 'groq-sdk';
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';
import type { GeneratedSchema } from 'types';
import { CConfigService } from '../../../../config/env.service';
import { buildRepairPrompt } from '../lib/build-repair-prompt.util';
import { LlmRequestTimeoutError } from '../lib/llm-request-timeout.error';
import { GeneratedSchemaValidationError } from '../lib/generated-schema-validation.error';
import { LlmConcurrencyLimiter } from '../lib/llm-concurrency.limiter';
import { LlmJsonParseError } from '../lib/llm-json-parse.error';
import { parseLlmJsonResponse } from '../lib/parse-llm-json.util';
import { isTransientProviderError } from '../lib/llm-provider-error.util';
import { withRetry, withTimeout } from '../lib/llm-retry.util';
import { DATABASE_SCHEMA_JSON_DESCRIPTION } from '../lib/schema-description';
import { SchemaGenerationMaxRetriesException } from '../lib/schema-generation-failed.error';
import {
  formatValidationErrors,
  validateGeneratedSchema,
} from '../lib/validate-generated-schema.util';

const BASE_JSON_PROMPT = `You are a strict database schema JSON generator.
Convert natural language business rules into structured database schema JSON.

Return ONLY valid JSON.
No markdown.
No explanations.
No code fences.

${DATABASE_SCHEMA_JSON_DESCRIPTION}

Rules:
- snake_case
- plural tables
- default id uuid primary key
- unique for email/username
- nullable=false by default
- references for relations

Return ONLY valid parseable JSON.
No markdown.
No explanations.`;

function issuesFromFailure(err: unknown): string[] {
  if (err instanceof LlmJsonParseError) {
    return [`[parse:${err.reason}] ${err.message}`];
  }
  if (err instanceof GeneratedSchemaValidationError) {
    return err.issues;
  }
  throw err;
}

@Injectable()
export class GroqSchemaProvider {
  private readonly client: Groq;

  private readonly model: string;

  private readonly logger = new Logger(GroqSchemaProvider.name);

  constructor(
    private readonly config: CConfigService,
    private readonly concurrency: LlmConcurrencyLimiter,
  ) {
    const apiKey = this.config.GROQ_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException(
        'GROQ_API_KEY is not configured',
      );
    }
    this.client = new Groq({ apiKey });
    const model = this.config.GROQ_MODEL;
    if (!model) {
      throw new InternalServerErrorException('GROQ_MODEL is not configured');
    }
    this.model = model;
  }

  private async callGroq(
    messages: ChatCompletionMessageParam[],
  ): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      temperature: 0.1,
      messages,
    });
    const content = completion.choices[0]?.message?.content;
    if (content == null || content === '') {
      throw new BadRequestException('Empty response from model');
    }
    return content;
  }

  private async generateRawResponse(
    messages: ChatCompletionMessageParam[],
  ): Promise<string> {
    const timeoutMs = this.config.llmRequestTimeoutMs;

    return withRetry(
      () =>
        withTimeout(
          this.callGroq(messages),
          timeoutMs,
          () => new LlmRequestTimeoutError(timeoutMs),
        ),
      {
        attempts: this.config.llmRetryAttempts,
        delayMs: this.config.llmRetryDelayMs,
        isRetryable: isTransientProviderError,
        onRetry: (err, attempt) => {
          this.logger.warn(
            `Groq transient error (attempt ${attempt}/${this.config.llmRetryAttempts}): ${err instanceof Error ? err.message : String(err)}`,
          );
        },
      },
    );
  }

  /**
   * Parse + manual + Zod validation with automatic repair prompts.
   * Serialized through {@link LlmConcurrencyLimiter} so concurrent HTTP requests
   * do not overwhelm the Groq provider.
   */
  async generateAndValidateJson(userPrompt: string): Promise<GeneratedSchema> {
    return this.concurrency.run(() =>
      this.generateAndValidateJsonInner(userPrompt),
    );
  }

  private async generateAndValidateJsonInner(
    userPrompt: string,
  ): Promise<GeneratedSchema> {
    const maxRetries = this.config.schemaGenerationMaxRetries;
    let messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: BASE_JSON_PROMPT },
      { role: 'user', content: userPrompt },
    ];

    let previousRaw = '';

    for (let repairsUsed = 0; repairsUsed <= maxRetries; repairsUsed++) {
      const rawResponse = await this.generateRawResponse(messages);

      if (this.config.isDevMode) {
        const preview =
          rawResponse.length > 4000
            ? `${rawResponse.slice(0, 4000)}…`
            : rawResponse;
        this.logger.debug(
          `[schema-gen] raw LLM response (attempt ${repairsUsed}): ${preview}`,
        );
      }

      if (
        this.config.isDevMode &&
        repairsUsed > 0 &&
        previousRaw !== '' &&
        previousRaw === rawResponse
      ) {
        this.logger.warn(
          '[schema-gen] Repair response is identical to the previous invalid response; model may not have applied fixes.',
        );
      }

      try {
        const parsed = parseLlmJsonResponse(rawResponse);
        const validated = validateGeneratedSchema(parsed);
        if (this.config.isDevMode && repairsUsed > 0) {
          const preview =
            rawResponse.length > 2000
              ? `${rawResponse.slice(0, 2000)}…`
              : rawResponse;
          this.logger.debug(
            `[schema-gen] validated OK after repair (attempt ${repairsUsed}): ${preview}`,
          );
        }
        return validated;
      } catch (err) {
        const issues = issuesFromFailure(err);

        if (this.config.isDevMode) {
          if (err instanceof LlmJsonParseError) {
            this.logger.debug(
              `[schema-gen] JSON parse failed (${err.reason}): ${err.message}`,
            );
          } else if (err instanceof GeneratedSchemaValidationError) {
            this.logger.debug(
              `[schema-gen] validation failed: ${formatValidationErrors(err.issues)}`,
            );
          }
        }

        if (repairsUsed >= maxRetries) {
          throw new SchemaGenerationMaxRetriesException({
            message:
              'Could not produce a valid database schema JSON after automatic repair attempts',
            attempts: repairsUsed + 1,
            maxRetries,
            lastIssues: issues,
          });
        }

        previousRaw = rawResponse;

        const repairMessage = buildRepairPrompt({
          userPrompt,
          invalidResponse: rawResponse,
          errors: formatValidationErrors(issues),
          schemaDescription: DATABASE_SCHEMA_JSON_DESCRIPTION,
        });

        messages = [
          { role: 'system', content: BASE_JSON_PROMPT },
          { role: 'user', content: userPrompt },
          { role: 'assistant', content: rawResponse },
          { role: 'user', content: repairMessage },
        ];
      }
    }

    throw new SchemaGenerationMaxRetriesException({
      message: 'Schema generation loop ended without a result',
      attempts: maxRetries + 1,
      maxRetries,
      lastIssues: [],
    });
  }
}
