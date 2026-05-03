import { Module } from '@nestjs/common';
import { DatabaseOutputModule } from '../database-output/database-output.module';
import { SchemaGeneratorModule } from '../schema-generator/schema-generator.module';
import { GenerateController } from './generate.controller';
import { GenerateService } from './generate.service';
import { LlmJsonService } from './llm-json.service';

@Module({
  imports: [SchemaGeneratorModule, DatabaseOutputModule],
  controllers: [GenerateController],
  providers: [GenerateService, LlmJsonService],
})
export class GenerateModule {}
