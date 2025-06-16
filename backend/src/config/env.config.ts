import { ConfigModuleOptions } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { isEnum, validateSync } from 'class-validator';
import { EnvironmentMode } from 'src/shared/types';
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
  validate: envValidate,
  envFilePath: `.${isEnum(process.env.NODE_ENV, EnvironmentMode) ? process.env.NODE_ENV : EnvironmentMode.Development}.env`,
};
