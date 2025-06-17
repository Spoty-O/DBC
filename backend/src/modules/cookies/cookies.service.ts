import { Injectable } from '@nestjs/common';
import { CookieOptions } from 'express';
import { Response } from 'express';
import { ApiConfigService } from '../api-config/api-config.service';
import { TCookiesKeys } from 'src/shared/types';

@Injectable()
export class CookiesService {
  private readonly cookieConfig: CookieOptions;

  constructor(private readonly configService: ApiConfigService) {
    this.cookieConfig = {
      httpOnly: true,
      secure: !this.configService.isDevMode,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      sameSite: this.configService.isDevMode ? 'none' : 'strict',
    };
  }

  async set(res: Response, name: TCookiesKeys, value: string) {
    res.cookie(name, value, this.cookieConfig);
  }

  async clear(res: Response, name: TCookiesKeys) {
    res.clearCookie(name, this.cookieConfig);
  }
}
