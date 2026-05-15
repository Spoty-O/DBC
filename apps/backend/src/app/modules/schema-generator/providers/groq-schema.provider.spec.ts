jest.mock('groq-sdk');

import Groq from 'groq-sdk';
import { GroqSchemaProvider } from './groq-schema.provider';
import { CConfigService } from '../../../../config/env.service';
import { LlmConcurrencyLimiter } from '../lib/llm-concurrency.limiter';
import { SchemaGenerationMaxRetriesException } from '../lib/schema-generation-failed.error';
import { VALID_MINIMAL_SCHEMA_JSON } from '../lib/test-fixtures';

describe('GroqSchemaProvider.generateAndValidateJson', () => {
  const GroqMocked = Groq as jest.MockedClass<typeof Groq>;

  function mockConfig(maxRetries = 2): CConfigService {
    return {
      GROQ_API_KEY: 'test-key',
      GROQ_MODEL: 'test-model',
      schemaGenerationMaxRetries: maxRetries,
      isDevMode: false,
      llmMaxConcurrentRequests: 2,
      llmRequestTimeoutMs: 60_000,
      llmRetryAttempts: 1,
      llmRetryDelayMs: 0,
    } as CConfigService;
  }

  function mockLimiter(): LlmConcurrencyLimiter {
    return {
      run: <T>(fn: () => Promise<T>) => fn(),
    } as LlmConcurrencyLimiter;
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns parsed object when first completion is valid JSON', async () => {
    GroqMocked.mockImplementation(
      () =>
        ({
          chat: {
            completions: {
              create: jest.fn().mockResolvedValue({
                choices: [{ message: { content: VALID_MINIMAL_SCHEMA_JSON } }],
              }),
            },
          },
        }) as never,
    );
    const p = new GroqSchemaProvider(mockConfig(), mockLimiter());
    const out = await p.generateAndValidateJson('please build users table');
    expect(out.tables[0].name).toBe('users');
    expect(typeof out.tables[0].fields[0].type).toBe('string');
  });

  it('retries with repair prompt when first response is malformed', async () => {
    const create = jest
      .fn()
      .mockResolvedValueOnce({
        choices: [{ message: { content: 'Sure! Here:' } }],
      })
      .mockResolvedValueOnce({
        choices: [{ message: { content: VALID_MINIMAL_SCHEMA_JSON } }],
      });

    GroqMocked.mockImplementation(
      () =>
        ({
          chat: {
            completions: {
              create,
            },
          },
        }) as never,
    );

    const p = new GroqSchemaProvider(mockConfig(2), mockLimiter());
    const out = await p.generateAndValidateJson('minimal user table');
    expect(create).toHaveBeenCalledTimes(2);
    expect(out.tables).toHaveLength(1);

    const secondCallMsgs = create.mock.calls[1][0].messages as {
      role: string;
      content: string;
    }[];
    const repairTurn = secondCallMsgs.find(
      (m) => typeof m.content === 'string' && m.content.includes('invalid JSON'),
    );
    expect(repairTurn).toBeTruthy();
    expect(secondCallMsgs.some((m) => m.role === 'assistant')).toBe(true);
  });

  it('throws SchemaGenerationMaxRetriesException after exhausting retries', async () => {
    const bad = '{"tables":[]}';
    const create = jest.fn().mockResolvedValue({
      choices: [{ message: { content: bad } }],
    });

    GroqMocked.mockImplementation(
      () =>
        ({
          chat: {
            completions: {
              create,
            },
          },
        }) as never,
    );

    const p = new GroqSchemaProvider(mockConfig(2), mockLimiter());
    await expect(
      p.generateAndValidateJson('any description here xxxxx'),
    ).rejects.toBeInstanceOf(SchemaGenerationMaxRetriesException);
    expect(create).toHaveBeenCalledTimes(3);
  });

  it('repair fixes invalid structure on second completion', async () => {
    const invalidJson = '{"tables":[{"name":"t","fields":[]}]}';
    const create = jest
      .fn()
      .mockResolvedValueOnce({
        choices: [{ message: { content: invalidJson } }],
      })
      .mockResolvedValueOnce({
        choices: [{ message: { content: VALID_MINIMAL_SCHEMA_JSON } }],
      });

    GroqMocked.mockImplementation(
      () =>
        ({
          chat: {
            completions: {
              create,
            },
          },
        }) as never,
    );

    const p = new GroqSchemaProvider(mockConfig(2), mockLimiter());
    const out = await p.generateAndValidateJson(
      'user table minimal spec xxxxxxxxx',
    );
    expect(create).toHaveBeenCalledTimes(2);
    expect(out.tables[0].fields.length).toBeGreaterThan(0);
  });
});
