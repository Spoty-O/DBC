import * as z from 'zod';
import { ConfigModuleOptions } from '@nestjs/config';
import path from 'path';

export enum EConfigEnvironment {
  prod = 'production',
  dev = 'development',
}

export const configSchemaValidation: z.ZodObject = z.object({
  NODE_ENV: z.enum(EConfigEnvironment),

  GROQ_API_KEY: z.string(),
  GROQ_MODEL: z.string(),
});

export type Env = z.infer<typeof configSchemaValidation>;

export const configOptions: ConfigModuleOptions = {
  envFilePath: path.resolve(process.cwd(), '.env'),
  // load: [config],
  validationSchema: configSchemaValidation,
  validationOptions: {
    allowUnknown: true,
    abortEarly: false,
  },
  isGlobal: true,
};
