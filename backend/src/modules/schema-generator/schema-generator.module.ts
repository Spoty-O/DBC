import { Module } from '@nestjs/common';
import { SchemaGeneratorService } from './schema-generator.service';
import { SchemaGeneratorController } from './schema-generator.controller';
import { NlpModule } from '../nlp/nlp.module';
import { RenderModule } from '../render/render.module';

@Module({
  imports: [NlpModule, RenderModule],
  controllers: [SchemaGeneratorController],
  providers: [SchemaGeneratorService],
})
export class SchemaGeneratorModule {}
