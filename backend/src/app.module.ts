import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './shared/filters/http-error.filter';
import { I18nModule } from 'nestjs-i18n';
import {
  ApiConfigModule,
  AuthModule,
  ErrorModule,
  SchemaGeneratorModule,
  UserModule,
} from './modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig, envConfig, i18nConfig } from './config';

@Module({
  imports: [
    ApiConfigModule.forRoot(envConfig),
    TypeOrmModule.forRootAsync(dbConfig),
    I18nModule.forRootAsync(i18nConfig),
    ErrorModule,
    SchemaGeneratorModule,
    UserModule,
    AuthModule,
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
