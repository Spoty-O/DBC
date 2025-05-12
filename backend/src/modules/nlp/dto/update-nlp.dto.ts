import { PartialType } from '@nestjs/swagger';
import { CreateNlpDto } from './create-nlp.dto';

export class UpdateNlpDto extends PartialType(CreateNlpDto) {}
