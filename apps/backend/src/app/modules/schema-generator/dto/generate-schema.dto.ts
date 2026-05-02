import { MinLength, IsString, IsOptional, IsEnum } from 'class-validator';
import { GenerationPersonality } from '../types/generation-personality.enum';

export class GenerateSchemaDto {
  @IsString()
  @MinLength(5)
  text!: string;

  @IsOptional()
  @IsEnum(GenerationPersonality)
  personality?: GenerationPersonality;
}
