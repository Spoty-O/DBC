import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import type { GeneratedSchema } from 'types';
import { AppModule } from '../app/app.module';
import { CConfigService } from '../config/env.service';
import { usersPostsSchema } from '../app/modules/database-output/test-fixtures';
import { GroqSchemaProvider } from '../app/modules/schema-generator/providers/groq-schema.provider';

export type GroqMock = Pick<GroqSchemaProvider, 'generateAndValidateJson'>;

export interface TestAppContext {
  app: INestApplication;
  moduleRef: TestingModule;
  groqMock: jest.Mocked<GroqMock>;
}

const testConfig: CConfigService = {
  isDevMode: false,
  PORT: 3000,
  GROQ_API_KEY: 'test-groq-key',
  GROQ_MODEL: 'test-model',
  schemaGenerationMaxRetries: 2,
} as CConfigService;

export async function createTestApp(options?: {
  groqImplementation?: (prompt: string) => Promise<GeneratedSchema>;
}): Promise<TestAppContext> {
  const defaultImpl = async (_prompt: string): Promise<GeneratedSchema> =>
    usersPostsSchema;

  const groqMock = {
    generateAndValidateJson: jest.fn(
      options?.groqImplementation ?? defaultImpl,
    ),
  } as jest.Mocked<GroqMock>;

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(CConfigService)
    .useValue(testConfig)
    .overrideProvider(GroqSchemaProvider)
    .useValue(groqMock)
    .compile();

  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api');
  await app.init();

  return { app, moduleRef, groqMock };
}

export async function closeTestApp(ctx: TestAppContext): Promise<void> {
  await ctx.app.close();
  await ctx.moduleRef.close();
}
