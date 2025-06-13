import { CacheModuleOptions } from '@nestjs/cache-manager';
import { CACHE_MAX_VALUES, CACHE_TTL } from 'src/shared/constants';

export const cacheConfig: CacheModuleOptions = {
  ttl: CACHE_TTL,
  max: CACHE_MAX_VALUES,
  isGlobal: true,
};
