import { IsEnum, IsString } from 'class-validator';
import { ERenderKeys } from 'src/shared/types';

export class CreateSchemaDto {
  @IsEnum(ERenderKeys)
  type!: ERenderKeys;

  @IsString()
  text!: string;
}
