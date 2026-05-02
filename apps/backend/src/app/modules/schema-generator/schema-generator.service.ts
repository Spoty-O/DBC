import { Injectable } from '@nestjs/common';
import { GenerateSchemaDto } from './dto/generate-schema.dto';
import { GroqSchemaProvider } from './providers/groq-schema.provider';
import { GenerationPersonality } from './types/generation-personality.enum';
import type { DatabaseSchema } from './types/database-schema.type';

@Injectable()
export class SchemaGeneratorService {
  constructor(private readonly groqSchema: GroqSchemaProvider) {}

  async generateJson(dto: GenerateSchemaDto): Promise<DatabaseSchema> {
    const personality = dto.personality ?? GenerationPersonality.DEFAULT;
    return this.groqSchema.generateDatabaseJson(dto.text, personality);
  }

  async explain(dto: GenerateSchemaDto): Promise<string> {
    const personality = dto.personality ?? GenerationPersonality.DEFAULT;
    return this.groqSchema.explainDatabaseSchema(dto.text, personality);
  }
}
