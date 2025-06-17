import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload, IUser } from 'src/shared/interfaces';
import { ApiConfigService } from '../api-config/api-config.service';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtHeaderStrategy extends PassportStrategy(
  Strategy,
  'jwt-header',
) {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.jwtSecret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: IJwtPayload): Promise<IUser> {
    return this.userService.findOneById(payload.sub);
  }
}
