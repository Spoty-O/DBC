import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import path from 'path';
import { ApiConfigService } from 'src/modules/api-config/api-config.service';

export const dbConfig: TypeOrmModuleAsyncOptions = {
  useFactory: (configService: ApiConfigService) => ({
    type: 'postgres',
    url: configService.postgreUrl,
    synchronize: configService.isDevMode,
    entities: [
      path.join(process.cwd(), '/dist/src/shared/entities/*.entity.js'),
    ],
    logging: true,
    logger: configService.isDevMode ? 'advanced-console' : 'file',
  }),
  inject: [ApiConfigService],
};
