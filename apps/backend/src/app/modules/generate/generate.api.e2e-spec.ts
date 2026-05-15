import request from 'supertest';
import { SchemaResultType } from 'types';
import {
  closeTestApp,
  createTestApp,
  type TestAppContext,
} from '../../../testing/create-test-app';
import {
  expectDomainError,
  expectValidationRejected,
} from '../../../testing/expect-http';
import {
  BUSINESS_RULES,
  OVERSIZED_TEXT,
  PRISMA_PAYLOAD,
  SQL_PAYLOAD,
  TYPEORM_PAYLOAD,
} from '../../../testing/payloads';

describe('POST /api/generate — API & validation (e2e)', () => {
  let ctx: TestAppContext;

  beforeEach(async () => {
    ctx = await createTestApp();
  });

  afterEach(async () => {
    await closeTestApp(ctx);
  });

  it.each([
    ['sql', SQL_PAYLOAD],
    ['prisma', PRISMA_PAYLOAD],
    ['typeorm', TYPEORM_PAYLOAD],
  ])(
    'returns 201 with schema, description, and model for %s',
    async (_label, payload) => {
      const res = await request(ctx.app.getHttpServer())
        .post('/api/generate')
        .send(payload)
        .expect(201);

      expect(res.body.schema).toEqual(expect.any(String));
      expect(res.body.schema.length).toBeGreaterThan(0);
      expect(res.body.description).toEqual(expect.any(String));
      expect(res.body.description.length).toBeGreaterThan(0);
      expect(res.body.model).toEqual(
        expect.objectContaining({
          tables: expect.arrayContaining([
            expect.objectContaining({ name: expect.any(String) }),
          ]),
        }),
      );
      expect(ctx.groqMock.generateAndValidateJson).toHaveBeenCalledWith(
        payload.text,
      );
    },
  );

  it('rejects empty business rules (DTO)', async () => {
    const res = await request(ctx.app.getHttpServer())
      .post('/api/generate')
      .send({ text: '', resultType: SchemaResultType.SQL })
      .expect(400);

    expectValidationRejected(res);
    expect(ctx.groqMock.generateAndValidateJson).not.toHaveBeenCalled();
  });

  it('rejects whitespace-only business rules (service Zod)', async () => {
    const res = await request(ctx.app.getHttpServer())
      .post('/api/generate')
      .send({ text: '   \n\t  ', resultType: SchemaResultType.SQL })
      .expect(400);

    expectDomainError(res, 'EMPTY_TEXT');
    expect(ctx.groqMock.generateAndValidateJson).not.toHaveBeenCalled();
  });

  it('rejects text longer than 50_000 characters', async () => {
    const res = await request(ctx.app.getHttpServer())
      .post('/api/generate')
      .send({ text: OVERSIZED_TEXT, resultType: SchemaResultType.SQL })
      .expect(400);

    expectValidationRejected(res);
    expect(ctx.groqMock.generateAndValidateJson).not.toHaveBeenCalled();
  });

  it('rejects invalid resultType', async () => {
    const res = await request(ctx.app.getHttpServer())
      .post('/api/generate')
      .send({ text: BUSINESS_RULES.blog, resultType: 'graphql' })
      .expect(400);

    expectValidationRejected(res);
    expect(ctx.groqMock.generateAndValidateJson).not.toHaveBeenCalled();
  });

  it('rejects malformed body (missing fields)', async () => {
    const res = await request(ctx.app.getHttpServer())
      .post('/api/generate')
      .send({ text: BUSINESS_RULES.blog })
      .expect(400);

    expectValidationRejected(res);
    expect(ctx.groqMock.generateAndValidateJson).not.toHaveBeenCalled();
  });

  it('rejects unknown properties (whitelist)', async () => {
    const res = await request(ctx.app.getHttpServer())
      .post('/api/generate')
      .send({
        text: BUSINESS_RULES.blog,
        resultType: SchemaResultType.SQL,
        evil: true,
      })
      .expect(400);

    expectValidationRejected(res);
    expect(ctx.groqMock.generateAndValidateJson).not.toHaveBeenCalled();
  });
});
