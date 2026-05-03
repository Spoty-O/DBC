import * as z from 'zod';
import { EConfigEnvironment } from '../common/enums';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import path from 'path';
import { Global, Module } from '@nestjs/common';
import { CConfigService } from './env.service';

export const configSchemaValidation: z.ZodObject = z.object({
  NODE_ENV: z.enum(EConfigEnvironment),
  PORT: z.number(),
  GROQ_API_KEY: z.string().min(1).max(1024),
  GROQ_MODEL: z.string().min(1).max(1024),
  /** Max repair rounds after a failed parse/validate (default read in CConfigService). */
  SCHEMA_GEN_MAX_RETRIES: z.coerce.number().int().min(0).max(10).optional(),
});

export type Env = z.infer<typeof configSchemaValidation>;

export const configOptions: ConfigModuleOptions = {
  envFilePath: path.resolve(process.cwd(), '.env'),
  // load: [config],
  validate: configSchemaValidation.safeParse,
  validationOptions: {
    allowUnknown: true,
    abortEarly: false,
  },
  isGlobal: true,
};

@Global()
@Module({
  imports: [ConfigModule.forRoot(configOptions)],
  providers: [CConfigService],
  exports: [CConfigService],
})
export class CConfigModule {}
