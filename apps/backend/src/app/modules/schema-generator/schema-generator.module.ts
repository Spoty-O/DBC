import { Module } from '@nestjs/common';
import { LlmConcurrencyLimiter } from './lib/llm-concurrency.limiter';
import { GroqSchemaProvider } from './providers/groq-schema.provider';

@Module({
  providers: [LlmConcurrencyLimiter, GroqSchemaProvider],
  exports: [LlmConcurrencyLimiter, GroqSchemaProvider],
})
export class SchemaGeneratorModule {}
