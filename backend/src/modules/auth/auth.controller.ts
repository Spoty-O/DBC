import { Controller, Post, Body, Res, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtCookiesAuthGuard } from 'src/shared/guards';
import { AuthDto } from './dto/auth.dto';
import { RequestWith } from 'src/shared/types';
import { IJwtPayload } from 'src/shared/interfaces';
import { CookiesService } from '../cookies/cookies.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookiesService: CookiesService,
  ) {}

  @Post('signup')
  async signUp(
    @Res({ passthrough: true }) res: Response,
    @Body() body: AuthDto,
  ) {
    const { accessToken, refreshToken } = await this.authService.signUp(body);
    this.cookiesService.set(res, 'refreshToken', refreshToken);
    return { accessToken };
  }

  @Post('signin')
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() body: AuthDto,
  ) {
    const { accessToken, refreshToken } = await this.authService.signIn(body);
    this.cookiesService.set(res, 'refreshToken', refreshToken);
    return { accessToken };
  }

  @Post('refresh')
  @UseGuards(JwtCookiesAuthGuard)
  async refresh(@Req() req: RequestWith<{ payload: IJwtPayload }>) {
    return await this.authService.refresh(req.payload);
  }
}
