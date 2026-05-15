import { BadRequestException } from '@nestjs/common';
import { LlmRequestTimeoutError } from '../schema-generator/lib/llm-request-timeout.error';
import request from 'supertest';
import { SchemaResultType } from 'types';
import { SchemaGenerationMaxRetriesException } from '../schema-generator/lib/schema-generation-failed.error';
import {
  closeTestApp,
  createTestApp,
  type TestAppContext,
} from '../../../testing/create-test-app';
import {
  expectDomainError,
  expectValidationRejected,
} from '../../../testing/expect-http';
import { BUSINESS_RULES } from '../../../testing/payloads';

describe('POST /api/generate — reliability (e2e)', () => {
  const validBody = {
    text: BUSINESS_RULES.blog,
    resultType: SchemaResultType.SQL,
  };

  afterEach(async () => {
    if (ctx) {
      await closeTestApp(ctx);
    }
  });

  let ctx: TestAppContext;

  it('returns LLM_TIMEOUT when Groq provider times out', async () => {
    ctx = await createTestApp({
      groqImplementation: async () => {
        throw new LlmRequestTimeoutError(5000);
      },
    });

    const res = await request(ctx.app.getHttpServer())
      .post('/api/generate')
      .send(validBody)
      .expect(504);

    expectDomainError(res, 'LLM_TIMEOUT', 504);
    expect(res.body.error.message).toMatch(/timed out/i);
  });

  it('returns LLM_RATE_LIMIT when provider is rate limited', async () => {
    ctx = await createTestApp({
      groqImplementation: async () => {
        const err = Object.assign(new Error('rate limit'), { status: 429 });
        throw err;
      },
    });

    const res = await request(ctx.app.getHttpServer())
      .post('/api/generate')
      .send(validBody)
      .expect(429);

    expectDomainError(res, 'LLM_RATE_LIMIT', 429);
  });

  it('returns LLM_PROVIDER_UNAVAILABLE when Groq API is unavailable', async () => {
    ctx = await createTestApp({
      groqImplementation: async () => {
        const err = Object.assign(new Error('service unavailable'), {
          status: 503,
        });
        throw err;
      },
    });

    const res = await request(ctx.app.getHttpServer())
      .post('/api/generate')
      .send(validBody)
      .expect(503);

    expectDomainError(res, 'LLM_PROVIDER_UNAVAILABLE', 503);
  });

  it('returns SCHEMA_VALIDATION when LLM returns invalid JSON', async () => {
    ctx = await createTestApp({
      groqImplementation: async () => {
        throw new BadRequestException('not valid JSON from model');
      },
    });

    const res = await request(ctx.app.getHttpServer())
      .post('/api/generate')
      .send(validBody)
      .expect(400);

    expect(res.body).toEqual({
      ok: false,
      error: {
        code: 'SCHEMA_VALIDATION',
        message: expect.stringContaining('not valid JSON'),
      },
    });
  });

  it('returns LLM_GENERATION on empty LLM response', async () => {
    ctx = await createTestApp({
      groqImplementation: async () => {
        throw new BadRequestException('Empty response from model');
      },
    });

    const res = await request(ctx.app.getHttpServer())
      .post('/api/generate')
      .send(validBody)
      .expect(400);

    expect(res.body.ok).toBe(false);
    expect(res.body.error.code).toBe('LLM_GENERATION');
    expect(res.body.error.message).toMatch(/empty response/i);
  });

  it('returns SCHEMA_VALIDATION after max repair retries', async () => {
    ctx = await createTestApp({
      groqImplementation: async () => {
        throw new SchemaGenerationMaxRetriesException({
          message: 'Could not produce valid schema JSON',
          attempts: 3,
          maxRetries: 2,
          lastIssues: ['tables: required'],
        });
      },
    });

    const res = await request(ctx.app.getHttpServer())
      .post('/api/generate')
      .send(validBody)
      .expect(400);

    expect(res.body.ok).toBe(false);
    expect(res.body.error.code).toBe('SCHEMA_VALIDATION');
  });

  it('does not crash on malformed JSON body', async () => {
    ctx = await createTestApp();

    const res = await request(ctx.app.getHttpServer())
      .post('/api/generate')
      .set('Content-Type', 'application/json')
      .send('{ not-json')
      .expect(400);

    expect(res.body.statusCode).toBe(400);
  });

  it('returns INVALID_RESULT_TYPE for unsupported result type at service layer', async () => {
    ctx = await createTestApp();

    const res = await request(ctx.app.getHttpServer())
      .post('/api/generate')
      .send({ text: BUSINESS_RULES.blog, resultType: 'mongodb' })
      .expect(400);

    expectValidationRejected(res);
  });
});
