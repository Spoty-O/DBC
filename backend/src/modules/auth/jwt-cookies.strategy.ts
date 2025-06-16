import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { IJwtPayload } from 'src/shared/interfaces';
import { ApiConfigService } from '../api-config/api-config.service';
import { RequestWith, TCookies } from 'src/shared/types';

@Injectable()
export class JwtCookiesStrategy extends PassportStrategy(
  Strategy,
  'jwt-cookies',
) {
  constructor(private readonly configService: ApiConfigService) {
    super({
      jwtFromRequest: JwtCookiesStrategy.fromCookiesToken,
      secretOrKey: configService.jwtSecret,
      ignoreExpiration: false,
    });
  }

  private static fromCookiesToken(req: RequestWith<{ cookies?: TCookies }>) {
    const token = req.cookies?.refreshToken;
    return token && token.length > 0 ? token : null;
  }

  validate(payload: IJwtPayload): IJwtPayload {
    return payload;
  }
}
