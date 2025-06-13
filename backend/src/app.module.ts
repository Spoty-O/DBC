import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './shared/filters/http-error.filter';
import { I18nModule } from 'nestjs-i18n';
import { ErrorModule, SchemaGeneratorModule, UserModule } from './modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { cacheConfig, dbConfig, envConfig, i18nConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    CacheModule.register(cacheConfig),
    TypeOrmModule.forRootAsync(dbConfig),
    I18nModule.forRootAsync(i18nConfig),
    ErrorModule,
    SchemaGeneratorModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    HttpExceptionFilter,
  ],
})
export class AppModule {}
