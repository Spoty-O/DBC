import { ConfigModuleOptions } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvDto } from '../modules/api-config/dto/env.dto';

function envValidate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvDto, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

export const envConfig: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: '../.env',
  validate: envValidate,
};
