import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { GenerateSchemaDto } from './dto/generate-schema.dto';
import { SchemaGeneratorHttpExceptionFilter } from './filters/schema-generator-http-exception.filter';
import { SchemaGeneratorService } from './schema-generator.service';

@Controller('schema-generator')
@UseFilters(SchemaGeneratorHttpExceptionFilter)
export class SchemaGeneratorController {
  constructor(private readonly schemaGeneratorService: SchemaGeneratorService) {}

  @Post('json')
  async generateJson(@Body() dto: GenerateSchemaDto) {
    const result = await this.schemaGeneratorService.generateJson(dto);
    return { ok: true as const, result };
  }

  @Post('explain')
  async explain(@Body() dto: GenerateSchemaDto) {
    const result = await this.schemaGeneratorService.explain(dto);
    return { ok: true as const, result };
  }
}
