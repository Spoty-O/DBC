import { Module } from '@nestjs/common';
import { GroqSchemaProvider } from './providers/groq-schema.provider';
import { SchemaGeneratorController } from './schema-generator.controller';
import { SchemaGeneratorService } from './schema-generator.service';

@Module({
  controllers: [SchemaGeneratorController],
  providers: [SchemaGeneratorService, GroqSchemaProvider],
})
export class SchemaGeneratorModule {}
