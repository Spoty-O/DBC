import { Module } from '@nestjs/common';
import { GroqSchemaProvider } from './providers/groq-schema.provider';

@Module({
  providers: [GroqSchemaProvider],
  exports: [GroqSchemaProvider],
})
export class SchemaGeneratorModule {}
