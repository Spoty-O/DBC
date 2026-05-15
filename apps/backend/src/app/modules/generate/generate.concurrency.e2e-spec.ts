import request from 'supertest';
import { SchemaResultType } from 'types';
import { usersPostsSchema } from '../database-output/test-fixtures';
import {
  closeTestApp,
  createTestApp,
  type TestAppContext,
} from '../../../testing/create-test-app';
import { PRISMA_PAYLOAD, TYPEORM_PAYLOAD } from '../../../testing/payloads';

describe('POST /api/generate — concurrent requests (e2e)', () => {
  let ctx: TestAppContext;

  afterEach(async () => {
    if (ctx) {
      await closeTestApp(ctx);
    }
  });

  const slowGroq = async () => {
    await new Promise((r) => setTimeout(r, 30));
    return usersPostsSchema;
  };

  it('returns 201 for four parallel Prisma requests', async () => {
    ctx = await createTestApp({ groqImplementation: slowGroq });

    const responses = await Promise.all(
      Array.from({ length: 4 }, () =>
        request(ctx.app.getHttpServer())
          .post('/api/generate')
          .send(PRISMA_PAYLOAD),
      ),
    );

    for (const res of responses) {
      expect(res.status).toBe(201);
      expect(res.body.schema).toEqual(expect.any(String));
    }
    expect(ctx.groqMock.generateAndValidateJson).toHaveBeenCalledTimes(4);
  });

  it('returns 201 for four parallel TypeORM requests', async () => {
    ctx = await createTestApp({ groqImplementation: slowGroq });

    const responses = await Promise.all(
      Array.from({ length: 4 }, () =>
        request(ctx.app.getHttpServer())
          .post('/api/generate')
          .send(TYPEORM_PAYLOAD),
      ),
    );

    for (const res of responses) {
      expect(res.status).toBe(201);
    }
  });

  it('returns 201 for mixed parallel result types', async () => {
    ctx = await createTestApp({ groqImplementation: slowGroq });

    const payloads = [
      { text: PRISMA_PAYLOAD.text, resultType: SchemaResultType.PRISMA },
      { text: TYPEORM_PAYLOAD.text, resultType: SchemaResultType.TYPEORM },
      { text: PRISMA_PAYLOAD.text, resultType: SchemaResultType.PRISMA },
      { text: TYPEORM_PAYLOAD.text, resultType: SchemaResultType.TYPEORM },
    ];

    const responses = await Promise.all(
      payloads.map((body) =>
        request(ctx.app.getHttpServer()).post('/api/generate').send(body),
      ),
    );

    expect(responses.every((r) => r.status === 201)).toBe(true);
  });
});
