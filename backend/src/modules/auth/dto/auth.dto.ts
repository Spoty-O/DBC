import { IsBoolean, IsOptional } from 'class-validator';
import { CreateUserDto } from 'src/modules/user/dto';

export class AuthDto extends CreateUserDto {
  @IsBoolean()
  @IsOptional()
  rememberMe: boolean = false;
}
