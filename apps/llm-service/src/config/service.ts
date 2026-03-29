import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from './schema';
import { EConfigEnvironment } from './schema';

@Injectable()
export class CConfigService {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  get isDevMode(): boolean {
    return this.configService.get('NODE_ENV') === EConfigEnvironment.dev;
  }

  get GROQ_API_KEY(): string {
    return this.configService.get('GROQ_API_KEY');
  }

  get GROQ_MODEL(): string {
    return this.configService.get('GROQ_MODEL');
  }
}
