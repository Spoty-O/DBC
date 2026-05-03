import { DATABASE_SCHEMA_JSON_DESCRIPTION } from './schema-description';

export interface BuildRepairPromptParams {
  userPrompt: string;
  invalidResponse: string;
  errors: string;
  /** Embed full schema expectation; defaults to DATABASE_SCHEMA_JSON_DESCRIPTION */
  schemaDescription?: string;
}

export function buildRepairPrompt(params: BuildRepairPromptParams): string {
  const schemaDescription =
    params.schemaDescription ?? DATABASE_SCHEMA_JSON_DESCRIPTION;

  return `You returned invalid JSON for a database schema generation task.

User request:
${params.userPrompt}

Invalid response:
${params.invalidResponse}

Errors:
${params.errors}

Expected schema:
${schemaDescription}

Fix the response.

Requirements:
- Return ONLY valid JSON
- No markdown
- No explanations
- No comments
- No text before or after JSON
- Follow the schema strictly
- Do not invent extra fields
- If data is missing, use null or empty arrays only where allowed by the schema`;
}
