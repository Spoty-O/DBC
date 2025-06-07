import { PartialType } from '@nestjs/swagger';
import { CreateSchemaDto } from './create-schema-generator.dto';

export class UpdateSchemaGeneratorDto extends PartialType(CreateSchemaDto) {}
