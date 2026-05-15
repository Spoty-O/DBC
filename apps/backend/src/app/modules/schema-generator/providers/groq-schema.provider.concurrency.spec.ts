jest.mock('groq-sdk');

import Groq from 'groq-sdk';
import { GroqSchemaProvider } from './groq-schema.provider';
import { CConfigService } from '../../../../config/env.service';
import { LlmConcurrencyLimiter } from '../lib/llm-concurrency.limiter';
import { VALID_MINIMAL_SCHEMA_JSON } from '../lib/test-fixtures';

describe('GroqSchemaProvider concurrency', () => {
  const GroqMocked = Groq as jest.MockedClass<typeof Groq>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('queues excess LLM pipelines when Groq calls are slow', async () => {
    let active = 0;
    let maxActive = 0;

    const create = jest.fn().mockImplementation(async () => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      await new Promise((r) => setTimeout(r, 80));
      active -= 1;
      return {
        choices: [{ message: { content: VALID_MINIMAL_SCHEMA_JSON } }],
      };
    });

    GroqMocked.mockImplementation(
      () =>
        ({
          chat: { completions: { create } },
        }) as never,
    );

    const config = {
      GROQ_API_KEY: 'key',
      GROQ_MODEL: 'model',
      schemaGenerationMaxRetries: 0,
      isDevMode: false,
      llmMaxConcurrentRequests: 2,
      llmRequestTimeoutMs: 60_000,
      llmRetryAttempts: 1,
      llmRetryDelayMs: 0,
    } as CConfigService;

    const provider = new GroqSchemaProvider(
      config,
      new LlmConcurrencyLimiter(config),
    );

    await Promise.all(
      Array.from({ length: 4 }, (_, i) =>
        provider.generateAndValidateJson(`prompt ${i}`),
      ),
    );

    expect(maxActive).toBeLessThanOrEqual(2);
    expect(create.mock.calls.length).toBe(4);
  });
});
