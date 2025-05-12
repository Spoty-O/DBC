import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { StaffModule } from './modules';

import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { CACHE_MAX_VALUES, CACHE_TTL } from './shared/constants/cache.const';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './shared/filters/http-error.filter';
import path from 'path';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { MongooseModule } from '@nestjs/mongoose';
import { NlpModule } from './modules/nlp/nlp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      ttl: CACHE_TTL,
      max: CACHE_MAX_VALUES,
      isGlobal: true,
    }),
    I18nModule.forRootAsync({
      useFactory: async () => ({
        loaderOptions: {
          path: path.join(process.cwd(), 'src/i18n/'),
          watch: true,
        },
        fallbackLanguage: process.env.FALLBACK_LANGUAGE || 'en',
        typesOutputPath: path.join(
          process.cwd(),
          'src/generated/i18n.generated.ts',
        ),
        logging: true,
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        { use: HeaderResolver, options: ['x-lang'] },
        { use: CookieResolver, options: ['x-lang'] },
        AcceptLanguageResolver,
      ],
      inject: [],
    }),
    MongooseModule.forRoot(process.env.DB_URL, {
      connectionErrorFactory: (error) => {
        console.log(error);
        process.exit(1);
      },
    }),
    ScheduleModule.forRoot(),
    StaffModule,
    NlpModule,
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
