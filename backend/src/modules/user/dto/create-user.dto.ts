import { IsEmail, IsStrongPassword, ValidateIf } from 'class-validator';
import { IUser } from 'src/shared/interfaces';
import { truncates } from 'bcryptjs';

export class CreateUserDto implements Omit<IUser, 'id'> {
  @IsEmail()
  email!: string;

  @IsStrongPassword()
  @ValidateIf((data: CreateUserDto) => truncates(data.password))
  password!: string;
}
