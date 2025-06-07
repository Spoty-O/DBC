import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

// import { StaffModule } from './modules';

// import { ScheduleModule } from '@nestjs/schedule';
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
import { SchemaGeneratorModule } from './modules';
import { ErrorModule } from './modules/error/error.module';
import { EnvironmentVariables, envValidate } from './config/env.config';
// import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: envValidate,
    }),
    CacheModule.register({
      ttl: CACHE_TTL,
      max: CACHE_MAX_VALUES,
      isGlobal: true,
    }),
    I18nModule.forRootAsync({
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => ({
        loaderOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: true,
        },
        fallbackLanguage: configService.getOrThrow('FALLBACK_LANGUAGE') || 'en',
        typesOutputPath: path.join(__dirname, '/generated/i18n.generated.ts'),
        logging: true,
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        { use: HeaderResolver, options: ['x-lang'] },
        { use: CookieResolver, options: ['x-lang'] },
        AcceptLanguageResolver,
      ],
      inject: [ConfigService],
    }),
    // MongooseModule.forRoot(process.env.DB_URL, {
    //   connectionErrorFactory: (error) => {
    //     console.log(error);
    //     process.exit(1);
    //   },
    // }),
    // ScheduleModule.forRoot(),
    // StaffModule,
    ErrorModule,
    SchemaGeneratorModule,
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
