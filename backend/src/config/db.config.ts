import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { EnvironmentVariables } from './env.config';
import { Environment } from 'src/shared/types';
import path from 'path';

export const dbConfig: TypeOrmModuleAsyncOptions = {
  useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
    type: 'postgres',
    url: configService.getOrThrow('DB_URL'),
    synchronize: configService.get('NODE_ENV') !== Environment.Production,
    entities: [
      path.join(process.cwd(), '/dist/src/shared/entities/*.entity.js'),
    ],
  }),
  inject: [ConfigService],
};
