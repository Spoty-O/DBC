import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GroqSchemaProvider } from '../schema-generator/providers/groq-schema.provider';
import { SchemaGenerationMaxRetriesException } from '../schema-generator/lib/schema-generation-failed.error';
import { LlmGenerationError, SchemaValidationError } from './errors/generate.errors';
import { LlmJsonService } from './llm-json.service';

describe('LlmJsonService', () => {
  it('maps max-retries schema failure to SchemaValidationError', async () => {
    const groq = {
      generateAndValidateJson: jest.fn().mockRejectedValue(
        new SchemaGenerationMaxRetriesException({
          message: 'failed',
          attempts: 3,
          maxRetries: 2,
          lastIssues: ['a', 'b'],
        }),
      ),
    };
    const mod = await Test.createTestingModule({
      providers: [
        LlmJsonService,
        { provide: GroqSchemaProvider, useValue: groq },
      ],
    }).compile();
    const svc = mod.get(LlmJsonService);
    await expect(svc.generateAndValidateJson('x')).rejects.toBeInstanceOf(
      SchemaValidationError,
    );
  });

  it('maps invalid JSON message to SchemaValidationError', async () => {
    const groq = {
      generateAndValidateJson: jest
        .fn()
        .mockRejectedValue(new BadRequestException('not valid JSON')),
    };
    const mod = await Test.createTestingModule({
      providers: [
        LlmJsonService,
        { provide: GroqSchemaProvider, useValue: groq },
      ],
    }).compile();
    const svc = mod.get(LlmJsonService);
    await expect(svc.generateAndValidateJson('y')).rejects.toBeInstanceOf(
      SchemaValidationError,
    );
  });

  it('maps unrelated BadRequest to LlmGenerationError', async () => {
    const groq = {
      generateAndValidateJson: jest
        .fn()
        .mockRejectedValue(new BadRequestException('rate limited')),
    };
    const mod = await Test.createTestingModule({
      providers: [
        LlmJsonService,
        { provide: GroqSchemaProvider, useValue: groq },
      ],
    }).compile();
    const svc = mod.get(LlmJsonService);
    await expect(svc.generateAndValidateJson('z')).rejects.toBeInstanceOf(
      LlmGenerationError,
    );
  });
});
