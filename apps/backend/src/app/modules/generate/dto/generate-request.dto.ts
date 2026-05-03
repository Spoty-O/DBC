import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import type { SchemaResultType } from 'types';

export class GenerateRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50_000)
  text!: string;

  @IsIn(['sql', 'typeorm', 'prisma'])
  resultType!: SchemaResultType;
}
