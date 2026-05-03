import type { ZodError } from 'zod';
import { DatabaseSchemaSchema, type DatabaseSchema } from '../schemas/database-schema.type';
import { GeneratedSchemaValidationError } from './generated-schema-validation.error';

function collectManualSchemaIssues(data: unknown): string[] {
  const issues: string[] = [];
  if (data === null || data === undefined) {
    issues.push('Payload must be a non-null JSON value');
    return issues;
  }
  if (typeof data !== 'object') {
    issues.push(`Payload must be a JSON object, got ${typeof data}`);
    return issues;
  }
  if (Array.isArray(data)) {
    issues.push('Payload must be a JSON object, not an array');
    return issues;
  }
  if (!('tables' in data)) {
    issues.push('Missing required property "tables"');
    return issues;
  }
  const tables = (data as { tables: unknown }).tables;
  if (!Array.isArray(tables)) {
    issues.push('Property "tables" must be an array');
    return issues;
  }
  if (tables.length === 0) {
    issues.push('Property "tables" must contain at least one table');
  }
  return issues;
}

function zodIssuesToStrings(error: ZodError): string[] {
  return error.issues.map((i) => {
    const path = i.path.length ? `${i.path.join('.')}: ` : '';
    return `${path}${i.message}`;
  });
}

export function formatValidationErrors(errors: string[]): string {
  if (errors.length === 0) {
    return '';
  }
  return errors.map((e, i) => `${i + 1}. ${e}`).join('\n');
}

/**
 * Runs manual structural checks, then Zod. Merges all issues if any step fails.
 * @returns Parsed and narrowed schema object (never a raw string).
 */
export function validateGeneratedSchema(data: unknown): DatabaseSchema {
  const manual = collectManualSchemaIssues(data);
  const zodResult = DatabaseSchemaSchema.safeParse(data);
  const zodIssues = zodResult.success ? [] : zodIssuesToStrings(zodResult.error);
  const merged = [...new Set([...manual, ...zodIssues])];
  if (merged.length > 0) {
    throw new GeneratedSchemaValidationError(merged);
  }
  return zodResult.data!;
}
