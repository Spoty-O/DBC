import { IsString } from 'class-validator';

export class CreateSchemaDto {
  @IsString()
  type!: string;

  @IsString()
  text!: string;
}
