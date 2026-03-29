import { Injectable, BadRequestException } from '@nestjs/common';
import { GroqService } from './groq.service';
import {
  buildNarrativePrompt,
  buildRequirementsPrompt,
  buildRepairedPrompt,
  LLM_SYSTEM_PROMPT,
} from '../prompts';
import {
  DbSchemaSchema,
  RequirementsSchema,
  TDbSchema,
  TRequirements,
} from '../schemas/index';

@Injectable()
export class AppService {
  constructor(private readonly groqService: GroqService) {}

  private extractJson(raw: string): unknown {
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start === -1 || end === -1) {
      throw new BadRequestException('Model did not return JSON');
    }

    return JSON.parse(raw.slice(start, end + 1));
  }

  private async generateValidatedJson<T>(
    prompt: string,
    parse: (value: unknown) => T,
  ): Promise<T> {
    const first = await this.groqService.generateText(
      LLM_SYSTEM_PROMPT,
      prompt,
    );

    try {
      return parse(this.extractJson(first));
    } catch {
      const repairPrompt = buildRepairedPrompt(first, prompt);

      const repaired = await this.groqService.generateText(
        LLM_SYSTEM_PROMPT,
        repairPrompt,
      );

      return parse(this.extractJson(repaired));
    }
  }

  async generate(
    text: string,
    character: 'none' | 'morpheus' | 'smith' = 'none',
  ): Promise<{
    requirements: TRequirements;
    schema: TDbSchema;
    narrative?: string;
  }> {
    const requirements = await this.generateValidatedJson(
      buildRequirementsPrompt(text),
      (value) => RequirementsSchema.parse(value),
    );

    const schema = await this.generateValidatedJson(
      buildRequirementsPrompt(JSON.stringify(requirements)),
      (value) => DbSchemaSchema.parse(value),
    );

    let narrative: string | undefined;

    if (character !== 'none') {
      narrative = await this.groqService.generateText(
        'You are a concise technical explainer.',
        buildNarrativePrompt(character, JSON.stringify(schema)),
      );
    }

    return { requirements, schema, narrative };
  }
}
