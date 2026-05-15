import request from 'supertest';
import { SqlDdlRendererService } from '../database-output/services/sql-ddl-renderer.service';
import {
  closeTestApp,
  createTestApp,
  type TestAppContext,
} from '../../../testing/create-test-app';
import { expectValidationRejected } from '../../../testing/expect-http';
import {
  PROMPT_INJECTION_PAYLOAD,
  SQL_PAYLOAD,
  SYSTEM_PROMPT_EXFIL_PAYLOAD,
  UNSAFE_SQL_INPUT_PAYLOAD,
  OVERSIZED_TEXT,
} from '../../../testing/payloads';

describe('POST /api/generate — security & safety (e2e)', () => {
  let ctx: TestAppContext;

  beforeEach(async () => {
    ctx = await createTestApp();
  });

  afterEach(async () => {
    await closeTestApp(ctx);
  });

  it('handles prompt injection without crashing and returns structured output', async () => {
    const res = await request(ctx.app.getHttpServer())
      .post('/api/generate')
      .send(PROMPT_INJECTION_PAYLOAD)
      .expect(201);

    expect(res.body.schema).toEqual(expect.any(String));
    expect(res.body.model).toBeDefined();
    expect(ctx.groqMock.generateAndValidateJson).toHaveBeenCalledWith(
      PROMPT_INJECTION_PAYLOAD.text,
    );
  });

  it('handles system-prompt exfiltration attempts without exposing config', async () => {
    const res = await request(ctx.app.getHttpServer())
      .post('/api/generate')
      .send(SYSTEM_PROMPT_EXFIL_PAYLOAD)
      .expect(201);

    const body = JSON.stringify(res.body);
    expect(body).not.toMatch(/GROQ_API_KEY|test-groq-key/i);
    expect(body).not.toMatch(/strict database schema json generator/i);
  });

  it('rejects oversized payloads before LLM call', async () => {
    const res = await request(ctx.app.getHttpServer())
      .post('/api/generate')
      .send({ text: OVERSIZED_TEXT, resultType: SQL_PAYLOAD.resultType })
      .expect(400);

    expectValidationRejected(res);
    expect(ctx.groqMock.generateAndValidateJson).not.toHaveBeenCalled();
  });

  it('returns generated SQL as text only (renderer does not execute SQL)', async () => {
    const res = await request(ctx.app.getHttpServer())
      .post('/api/generate')
      .send(UNSAFE_SQL_INPUT_PAYLOAD)
      .expect(201);

    expect(typeof res.body.schema).toBe('string');
    expect(res.body.schema.length).toBeGreaterThan(0);
  });

  it('SqlDdlRendererService only renders text and has no SQL execution hooks', () => {
    const renderer = new SqlDdlRendererService();
    const proto = Object.getPrototypeOf(renderer) as object;
    const methodNames = Object.getOwnPropertyNames(proto);
    const forbidden = ['execute', 'query', 'connect', 'run', 'exec'];
    for (const name of forbidden) {
      expect(methodNames).not.toContain(name);
      expect((renderer as unknown as Record<string, unknown>)[name]).toBeUndefined();
    }
  });
});
