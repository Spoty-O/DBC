import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { buildPersonalityPrompt } from '../personality-prompt';
import { GenerationPersonality } from '../types/generation-personality.enum';
import type {
  DatabaseField,
  DatabaseFieldType,
  DatabaseSchema,
} from '../types/database-schema.type';

const BASE_JSON_PROMPT = `You are a strict database schema JSON generator.
Convert natural language business rules into structured database schema JSON.

Return ONLY valid JSON.
No markdown.
No explanations.
No code fences.

Structure:
{
  "tables": [
    {
      "name": "table_name",
      "fields": [...]
    }
  ]
}

Rules:
- snake_case
- plural tables
- default id uuid primary key
- unique for email/username
- nullable=false by default
- references for relations

Return ONLY valid parseable JSON.
No markdown.
No explanations.`;

const ALLOWED_FIELD_TYPES: ReadonlySet<string> = new Set<DatabaseFieldType>([
  'string',
  'text',
  'number',
  'integer',
  'boolean',
  'date',
  'datetime',
  'uuid',
]);

function stripCodeFences(raw: string): string {
  const trimmed = raw.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)\s*```$/i.exec(trimmed);
  if (fence?.[1]) {
    return fence[1].trim();
  }
  return trimmed;
}

function parseJsonObject(content: string): unknown {
  const cleaned = stripCodeFences(content);
  try {
    return JSON.parse(cleaned) as unknown;
  } catch {
    throw new BadRequestException(
      'Model returned content that is not valid JSON',
    );
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertDatabaseField(
  field: unknown,
  path: string,
): asserts field is DatabaseField {
  if (!isPlainObject(field)) {
    throw new BadRequestException(`${path}: field must be an object`);
  }
  if (typeof field.name !== 'string' || field.name.length === 0) {
    throw new BadRequestException(`${path}: field.name is required`);
  }
  if (typeof field.type !== 'string' || !ALLOWED_FIELD_TYPES.has(field.type)) {
    throw new BadRequestException(`${path}: field.type is invalid`);
  }
  if (typeof field.nullable !== 'boolean') {
    throw new BadRequestException(`${path}: field.nullable must be boolean`);
  }
  if (typeof field.primary !== 'boolean') {
    throw new BadRequestException(`${path}: field.primary must be boolean`);
  }
  if (typeof field.unique !== 'boolean') {
    throw new BadRequestException(`${path}: field.unique must be boolean`);
  }
  if (field.references !== undefined) {
    if (!isPlainObject(field.references)) {
      throw new BadRequestException(`${path}: references must be an object`);
    }
    const ref = field.references;
    if (typeof ref.table !== 'string' || typeof ref.field !== 'string') {
      throw new BadRequestException(
        `${path}: references.table and references.field must be strings`,
      );
    }
  }
}

function assertDatabaseSchema(data: unknown): DatabaseSchema {
  if (!isPlainObject(data)) {
    throw new BadRequestException('Schema root must be an object');
  }
  if (!Array.isArray(data.tables)) {
    throw new BadRequestException('Schema must contain a tables array');
  }
  data.tables.forEach((table, ti) => {
    const tp = `tables[${ti}]`;
    if (!isPlainObject(table)) {
      throw new BadRequestException(`${tp}: table must be an object`);
    }
    if (typeof table.name !== 'string' || table.name.length === 0) {
      throw new BadRequestException(`${tp}: table.name is required`);
    }
    if (!Array.isArray(table.fields)) {
      throw new BadRequestException(`${tp}: fields must be an array`);
    }
    table.fields.forEach((f, fi) => {
      assertDatabaseField(f, `${tp}.fields[${fi}]`);
    });
  });
  return data as unknown as DatabaseSchema;
}

@Injectable()
export class GroqSchemaProvider {
  private readonly client: Groq;

  private readonly model: string;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('GROQ_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException(
        'GROQ_API_KEY is not configured',
      );
    }
    this.client = new Groq({ apiKey });
    const model = this.config.get<string>('GROQ_MODEL');
    if (!model) {
      throw new InternalServerErrorException('GROQ_MODEL is not configured');
    }
    this.model = model;
  }

  async generateDatabaseJson(
    text: string,
    _personality: GenerationPersonality,
  ): Promise<DatabaseSchema> {
    void _personality;
    const completion = await this.client.chat.completions.create({
      model: this.model,
      temperature: 0.1,
      messages: [
        { role: 'system', content: BASE_JSON_PROMPT },
        {
          role: 'user',
          content: text,
        },
      ],
    });
    const content = completion.choices[0]?.message?.content;
    if (content == null || content === '') {
      throw new BadRequestException('Empty response from model');
    }
    const parsed = parseJsonObject(content);
    return assertDatabaseSchema(parsed);
  }

  async explainDatabaseSchema(
    text: string,
    personality: GenerationPersonality,
  ): Promise<string> {
    const style = buildPersonalityPrompt(personality);
    const system = `${style}

Explain the database structure implied by the user's description clearly and accurately.
Do not output JSON or schema dumps unless helpful as a short illustration; prefer plain explanation text.`;

    const completion = await this.client.chat.completions.create({
      model: this.model,
      temperature: 0.1,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: text },
      ],
    });
    const content = completion.choices[0]?.message?.content;
    if (content == null || content === '') {
      throw new BadRequestException('Empty response from model');
    }
    return content.trim();
  }
}
