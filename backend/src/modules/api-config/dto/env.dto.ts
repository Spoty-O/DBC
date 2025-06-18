import { IsEnum, IsOptional, IsPort, IsString, IsUrl } from 'class-validator';
import { EnvironmentMode } from 'src/shared/types';

export class EnvDto {
  @IsEnum(EnvironmentMode)
  @IsOptional()
  NODE_ENV: EnvironmentMode = EnvironmentMode.Development;

  @IsPort()
  BE_PORT!: string;

  @IsString()
  POSTGRE_URL!: string;

  @IsString()
  @IsOptional()
  FALLBACK_LANGUAGE: string = 'en';

  @IsUrl({ protocols: ['http', 'https'] })
  OWN_URL!: string;

  @IsString()
  JWT_SECRET!: string;

  @IsString()
  REDIS_URL!: string;
}
