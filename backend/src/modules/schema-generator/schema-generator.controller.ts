import { Controller, Post, Body } from '@nestjs/common';
import { SchemaGeneratorService } from './schema-generator.service';
import { CreateSchemaDto } from './dto';

@Controller('schema-generator')
export class SchemaGeneratorController {
  constructor(
    private readonly schemaGeneratorService: SchemaGeneratorService,
  ) {}

  @Post('/')
  create(@Body() body: CreateSchemaDto) {
    return this.schemaGeneratorService.create(body);
  }

  // @Get()
  // findAll() {
  //   return this.schemaGeneratorService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.schemaGeneratorService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateSchemaGeneratorDto: UpdateSchemaGeneratorDto,
  // ) {
  //   return this.schemaGeneratorService.update(+id, updateSchemaGeneratorDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.schemaGeneratorService.remove(+id);
  // }
}
