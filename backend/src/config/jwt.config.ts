import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ApiConfigService } from 'src/modules/api-config/api-config.service';

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: (configService: ApiConfigService) => ({
    secret: configService.jwtSecret,
  }),
  inject: [ApiConfigService],
};
