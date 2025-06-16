import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from 'src/shared/interfaces';
import { ApiConfigService } from '../api-config/api-config.service';

@Injectable()
export class JwtHeaderStrategy extends PassportStrategy(
  Strategy,
  'jwt-header',
) {
  constructor(private readonly configService: ApiConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.jwtSecret,
      ignoreExpiration: false,
    });
  }

  validate(payload: IJwtPayload): IJwtPayload {
    return payload;
  }
}
