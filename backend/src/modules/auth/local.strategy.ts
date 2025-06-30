import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { IUser } from 'src/shared/interfaces';
import { UserService } from '../user/user.service';
import { compareSync } from 'bcryptjs';
import { ErrorService } from '../error/error.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly errorService: ErrorService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<IUser> {
    const user = await this.userService.findOneByEmail(email);
    if (!compareSync(password, user.password)) {
      throw await this.errorService.unauthorized();
    }
    return user;
  }
}
