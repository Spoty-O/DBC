import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { jwtConfig } from 'src/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CookiesModule } from '../cookies/cookies.module';
import { JwtHeaderStrategy } from './jwt-header.strategy';
import { JwtCookiesStrategy } from './jwt-cookies.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync(jwtConfig),
    CookiesModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtHeaderStrategy,
    JwtCookiesStrategy,
    LocalStrategy,
  ],
})
export class AuthModule {}
