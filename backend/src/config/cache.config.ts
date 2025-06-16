import { createKeyv } from '@keyv/redis';
import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ApiConfigService } from 'src/modules/api-config/api-config.service';
import { CACHE_MAX_VALUES, CACHE_TTL } from 'src/shared/constants';

export const cacheConfig: CacheModuleAsyncOptions = {
  useFactory: (configService: ApiConfigService) => ({
    ttl: CACHE_TTL,
    max: CACHE_MAX_VALUES,
    stores: [createKeyv(configService.redisUrl)],
  }),
  inject: [ApiConfigService],
};
