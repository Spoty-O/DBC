import { SchemaResultType } from 'types';
import { DatabaseOutputService } from './database-output.service';
import { DatabaseDescriptionService } from './services/database-description.service';
import { PrismaRendererService } from './services/prisma-renderer.service';
import { SqlDdlRendererService } from './services/sql-ddl-renderer.service';
import { TypeOrmRendererService } from './services/typeorm-renderer.service';
import { usersPostsSchema } from './test-fixtures';
import { InvalidSchemaError, UnsupportedModeError } from './errors/database-output.errors';

describe('DatabaseOutputService', () => {
  const service = new DatabaseOutputService(
    new SqlDdlRendererService(),
    new TypeOrmRendererService(),
    new PrismaRendererService(),
    new DatabaseDescriptionService(),
  );

  it('defaults to SQL and returns schema + brief description', () => {
    const r = service.generateOutput({
      userPrompt: 'Blog',
      schema: usersPostsSchema,
    });
    expect(r.schema).toContain('CREATE TABLE');
    expect(r.description.length).toBeGreaterThan(10);
    expect(r.description).toMatch(/table/i);
  });

  it('throws UnsupportedModeError for invalid resultType', () => {
    expect(() =>
      service.generateOutput({
        userPrompt: 'x',
        schema: usersPostsSchema,
        resultType: 'graphql' as never,
      }),
    ).toThrow(UnsupportedModeError);
  });

  it('throws InvalidSchemaError for invalid schema', () => {
    expect(() =>
      service.generateOutput({
        userPrompt: 'valid prompt text',
        schema: { tables: [] } as never,
      }),
    ).toThrow(InvalidSchemaError);
  });

  it('returns typeorm schema when requested', () => {
    const r = service.generateOutput({
      userPrompt: 'CRM',
      schema: usersPostsSchema,
      resultType: SchemaResultType.TYPEORM,
    });
    expect(r.schema).toContain('@Entity');
  });

  it('returns prisma schema when requested', () => {
    const r = service.generateOutput({
      userPrompt: 'CRM',
      schema: usersPostsSchema,
      resultType: SchemaResultType.PRISMA,
    });
    expect(r.schema).toContain('model Users');
  });
});
