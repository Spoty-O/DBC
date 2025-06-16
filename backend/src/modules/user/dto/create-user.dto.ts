import { IsEmail, IsString, ValidateIf } from 'class-validator';
import { IUser } from 'src/shared/interfaces';
import { truncates } from 'bcryptjs';

export class CreateUserDto implements Omit<IUser, 'id'> {
  @IsEmail()
  email!: string;

  @IsString()
  @ValidateIf((data: CreateUserDto) => truncates(data.password))
  password!: string;
}
