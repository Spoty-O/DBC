import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { ApiConfigService } from './api-config.service';

@Module({})
export class ApiConfigModule {
  static forRoot(options?: ConfigModuleOptions): DynamicModule {
    return {
      global: options?.isGlobal ?? false,
      module: ApiConfigModule,
      imports: [ConfigModule.forRoot(options)],
      providers: [ApiConfigService],
      exports: [ApiConfigService],
    };
  }
}
