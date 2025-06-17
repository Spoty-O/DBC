import { Controller, Post, Body, Res, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtCookiesAuthGuard } from 'src/shared/guards';
import { AuthDto } from './dto/auth.dto';
import { RequestWith } from 'src/shared/types';
import { IUser } from 'src/shared/interfaces';
import { CookiesService } from '../cookies/cookies.service';
import { LocalAuthGuard } from 'src/shared/guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookiesService: CookiesService,
  ) {}

  @Post('signup')
  async signUp(
    @Req() req: RequestWith<{ user: IUser }>,
    @Res({ passthrough: true }) res: Response,
    @Body() body: AuthDto,
  ) {
    req.user = await this.authService.signUp(body);
    return this.signIn(req, res, body);
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  async signIn(
    @Req() req: RequestWith<{ user: IUser }>,
    @Res({ passthrough: true }) res: Response,
    @Body() body: AuthDto,
  ) {
    const { accessToken, refreshToken } = await this.authService.signIn(
      req.user,
      body.rememberMe,
    );
    this.cookiesService.set(res, 'refreshToken', refreshToken);
    return { accessToken };
  }

  @Post('refresh')
  @UseGuards(JwtCookiesAuthGuard)
  async refresh(@Req() req: RequestWith<{ user: IUser }>) {
    return await this.authService.refresh(req.user);
  }

  @Post('logout')
  @UseGuards(JwtCookiesAuthGuard)
  async logout(@Res({ passthrough: true }) res: Response) {
    return await this.cookiesService.clear(res, 'refreshToken');
  }
}
