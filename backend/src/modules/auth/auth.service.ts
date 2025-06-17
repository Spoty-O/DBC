import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { compareSync } from 'bcryptjs';
import { ErrorService } from '../error/error.service';
import { IUser } from 'src/shared/interfaces';
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
    return await this.userService.create(body);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!compareSync(password, user.password)) {
      throw await this.errorService.unauthorized();
    }
    return user;
  }

  private async generateTokens(id: string, rememberMe: boolean) {
    const accessToken = this.jwtService.sign(
      { sub: id },
      { expiresIn: '15min' },
    );
    const refreshToken = this.jwtService.sign(
      { sub: id },
      {
        expiresIn: rememberMe ? '30d' : '5d',
      },
    );
    return { accessToken, refreshToken };
  }

  async signIn(user: IUser, rememberMe: boolean) {
    return await this.generateTokens(user.id, rememberMe);
  }

  async refresh(user: IUser) {
    const { id } = user;
    return {
      accessToken: this.jwtService.sign({ sub: id }, { expiresIn: '15min' }),
    };
  }
}
