import { SchemaResultType } from 'types';
import { DatabaseOutputService } from '../database-output/database-output.service';
import { usersPostsSchema } from '../database-output/test-fixtures';
import {
  EmptyTextError,
  InvalidResultTypeError,
} from './errors/generate.errors';
import { GenerateService } from './generate.service';
import { LlmJsonService } from './llm-json.service';

describe('GenerateService', () => {
  const makeService = (llm: Partial<LlmJsonService>, db: Partial<DatabaseOutputService>) =>
    new GenerateService(llm as LlmJsonService, db as DatabaseOutputService);

  it('runs full pipeline: LLM JSON then schema + description', async () => {
    const llm: Partial<LlmJsonService> = {
      generateAndValidateJson: jest.fn().mockResolvedValue(usersPostsSchema),
    };
    const db: Partial<DatabaseOutputService> = {
      generateOutput: jest.fn().mockImplementation((req) => ({
        schema: 'DDL',
        description: 'Two tables with FK.',
      })),
    };
    const svc = makeService(llm, db);
    const r = await svc.generate({
      text: 'Build a blog',
      resultType: SchemaResultType.SQL,
    });
    expect(llm.generateAndValidateJson).toHaveBeenCalledWith('Build a blog');
    expect(db.generateOutput).toHaveBeenCalledWith({
      userPrompt: 'Build a blog',
      schema: usersPostsSchema,
      resultType: SchemaResultType.SQL,
    });
    expect(Object.keys(r).sort()).toEqual(['description', 'model', 'schema']);
    expect(r.model).toBe(usersPostsSchema);
    expect(r.schema).toBe('DDL');
    expect(r.description).toBe('Two tables with FK.');
  });

  it('rejects invalid resultType', async () => {
    const svc = makeService({}, {});
    await expect(
      svc.generate({
        text: 'ok prompt text here',
        resultType: 'graphql' as never,
      }),
    ).rejects.toBeInstanceOf(InvalidResultTypeError);
  });

  it('rejects empty text after trim', async () => {
    const svc = makeService({}, {});
    await expect(
      svc.generate({
        text: '   ',
        resultType: SchemaResultType.SQL,
      }),
    ).rejects.toBeInstanceOf(EmptyTextError);
  });
});
