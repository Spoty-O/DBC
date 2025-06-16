import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from 'src/shared/interfaces';
import { ApiConfigService } from '../api-config/api-config.service';
import { CookiesDto } from './dto/cookies.dto';
import { RequestWith } from 'src/shared/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ApiConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        JwtStrategy.fromCookiesToken,
      ]),
      secretOrKey: configService.jwtSecret,
      ignoreExpiration: false,
    });
  }

  private static fromCookiesToken(req: RequestWith<{ cookies: CookiesDto }>) {
    if (req.cookies.refreshTokenId.length <= 0) {
      return null;
    }
    return req.cookies.refreshTokenId;
  }

  validate(payload: IJwtPayload): IJwtPayload {
    return payload;
  }
}
