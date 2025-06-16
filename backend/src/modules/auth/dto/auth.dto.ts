import { IsBoolean } from 'class-validator';
import { CreateUserDto } from 'src/modules/user/dto';

export class AuthDto extends CreateUserDto {
  @IsBoolean()
  rememberMe!: boolean;
}
