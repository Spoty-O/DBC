import { Controller, Post, Body, Res, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CookieOptions, Response } from 'express';
import { CookiesKeys } from 'src/shared/types/cookies.type';
import { ApiConfigService } from '../api-config/api-config.service';
import { CookiesGuard, JwtAuthGuard } from 'src/shared/guards';
import { AuthDto } from './dto/auth.dto';
import { RequestWith } from 'src/shared/types';
import { IJwtPayload } from 'src/shared/interfaces';

@Controller('auth')
export class AuthController {
  private readonly cookieConfig: CookieOptions;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ApiConfigService,
  ) {
    this.cookieConfig = {
      httpOnly: true,
      secure: !this.configService.isDevMode,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      sameSite: this.configService.isDevMode ? 'none' : 'strict',
    };
  }

  @Post('signup')
  async signUp(
    @Res({ passthrough: true }) res: Response,
    @Body() body: AuthDto,
  ) {
    const { accessToken, refreshToken } = await this.authService.signUp(body);
    res.cookie(CookiesKeys.RefreshToken, refreshToken, this.cookieConfig);
    return { accessToken };
  }

  @Post('signin')
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() body: AuthDto,
  ) {
    const { accessToken, refreshToken } = await this.authService.signIn(body);
    res.cookie(CookiesKeys.RefreshToken, refreshToken, this.cookieConfig);
    return { accessToken };
  }

  @Post('refresh')
  @UseGuards(CookiesGuard, JwtAuthGuard)
  async refresh(@Req() req: RequestWith<{ payload: IJwtPayload }>) {
    return await this.authService.refresh(req.payload);
  }
}
