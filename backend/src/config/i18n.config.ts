import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nAsyncOptions,
  QueryResolver,
} from 'nestjs-i18n';
import path from 'path';
import { ApiConfigService } from 'src/modules/api-config/api-config.service';

export const i18nConfig: I18nAsyncOptions = {
  useFactory: (configService: ApiConfigService) => ({
    loaderOptions: {
      path: path.join(process.cwd(), 'dist/src/i18n'),
      watch: true,
    },
    fallbackLanguage: configService.fallbackLanguage,
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
  inject: [ApiConfigService],
};
