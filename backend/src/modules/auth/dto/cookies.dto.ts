import { IsJWT } from 'class-validator';
import { ICookies } from 'src/shared/interfaces/cookies.interface';

export class CookiesDto implements ICookies {
  [key: string]: string;

  @IsJWT()
  refreshTokenId!: string;
}
