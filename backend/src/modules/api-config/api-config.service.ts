import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvDto } from './dto/env.dto';
import { EnvironmentMode } from 'src/shared/types';

@Injectable()
export class ApiConfigService {
  constructor(private readonly configService: ConfigService<EnvDto, true>) {}

  get isDevMode(): boolean {
    return this.configService.get('NODE_ENV') === EnvironmentMode.Development;
  }

  get postgreUrl(): string {
    return this.configService.get('POSTGRE_URL');
  }

  get redisUrl(): string {
    return this.configService.get('REDIS_URL');
  }

  get fallbackLanguage(): string {
    return this.configService.get('FALLBACK_LANGUAGE');
  }

  get jwtSecret(): string {
    return this.configService.get('JWT_SECRET');
  }

  get ownUrl(): string {
    return this.configService.get('OWN_URL');
  }

  get port(): number {
    return this.configService.get('PORT');
  }
}
