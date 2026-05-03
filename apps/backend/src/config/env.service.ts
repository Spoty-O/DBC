import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from './env.config';
import { EConfigEnvironment } from '../common/enums';

@Injectable()
export class CConfigService {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  get isDevMode(): boolean {
    return this.configService.get('NODE_ENV') === EConfigEnvironment.dev;
  }

  get PORT(): number {
    return this.configService.get('PORT');
  }

  get GROQ_API_KEY(): string {
    return this.configService.get('GROQ_API_KEY');
  }

  get GROQ_MODEL(): string {
    return this.configService.get('GROQ_MODEL');
  }

  /**
   * How many repair prompts to run after the first failed parse/validate (default 2).
   */
  get schemaGenerationMaxRetries(): number {
    const v = this.configService.get('SCHEMA_GEN_MAX_RETRIES');
    return v !== undefined && v !== null ? v : 2;
  }
}
