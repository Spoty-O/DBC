import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RequestWith } from '../types';
import { ICookies } from '../interfaces/cookies.interface';
import { CookiesDto } from 'src/modules/auth/dto/cookies.dto';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

@Injectable()
export class CookiesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: RequestWith<{ cookies: ICookies }> = context
      .switchToHttp()
      .getRequest();
    const validatedCookies = plainToInstance(CookiesDto, request.cookies, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(validatedCookies, {
      skipMissingProperties: false,
    });
    if (errors.length > 0) {
      throw new Error(errors.toString());
    }
    return true;
  }
}
