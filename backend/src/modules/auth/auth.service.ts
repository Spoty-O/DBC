import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { compareSync } from 'bcryptjs';
import { ErrorService } from '../error/error.service';
import { IJwtPayload } from 'src/shared/interfaces';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly errorService: ErrorService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(body: AuthDto) {
    const { id } = await this.userService.create(body);
    return await this.generateTokens({ sub: id }, body.rememberMe);
  }

  private async validateUser(body: AuthDto) {
    const { email, password } = body;
    const user = await this.userService.findOneByEmail(email);
    if (!compareSync(password, user.password)) {
      throw await this.errorService.unauthorized();
    }
    return user;
  }

  private async generateTokens(payload: IJwtPayload, rememberMe: boolean) {
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15min' });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: rememberMe ? '30d' : '5d',
    });
    return { accessToken, refreshToken };
  }

  async signIn(body: AuthDto) {
    const { id } = await this.validateUser(body);
    return await this.generateTokens({ sub: id }, body.rememberMe);
  }

  async refresh(payload: IJwtPayload) {
    return this.jwtService.sign(payload, { expiresIn: '15min' });
  }
}
