import { ConfigService } from '@nestjs/config';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nAsyncOptions,
  QueryResolver,
} from 'nestjs-i18n';
import { EnvironmentVariables } from './env.config';
import path from 'path';

export const i18nConfig: I18nAsyncOptions = {
  useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
    loaderOptions: {
      path: path.join(process.cwd(), 'dist/src/i18n'),
      watch: true,
    },
    fallbackLanguage: configService.getOrThrow('FALLBACK_LANGUAGE'),
    typesOutputPath: path.join(
      process.cwd(),
      'dist/src/generated/i18n.generated.js',
    ),
    logging: true,
  }),
  resolvers: [
    { use: QueryResolver, options: ['lang'] },
    { use: HeaderResolver, options: ['x-lang'] },
    { use: CookieResolver, options: ['x-lang'] },
    AcceptLanguageResolver,
  ],
  inject: [ConfigService],
};
