import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { IUser } from 'src/shared/interfaces';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(body: AuthDto) {
    return await this.userService.create(body);
  }

  async signIn(user: IUser, rememberMe: boolean) {
    const accessToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '15min' },
    );
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        expiresIn: rememberMe ? '30d' : '5d',
      },
    );
    return { accessToken, refreshToken };
  }

  async refresh(user: IUser) {
    const { id } = user;
    return {
      accessToken: this.jwtService.sign({ sub: id }, { expiresIn: '15min' }),
    };
  }
}
