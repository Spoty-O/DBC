import { UnsafeIdentifierError } from '../errors/database-output.errors';

const CONTROL_RE = /[\u0000-\u001f\u007f]/;

/**
 * PostgreSQL double-quoted identifier with internal quotes escaped.
 */
export function escapePgIdentifier(raw: string): string {
  if (raw.length === 0) {
    throw new UnsafeIdentifierError(raw, 'empty identifier');
  }
  if (CONTROL_RE.test(raw)) {
    throw new UnsafeIdentifierError(raw, 'control characters are not allowed');
  }
  if (raw.includes(';')) {
    throw new UnsafeIdentifierError(raw, 'semicolon is not allowed');
  }
  const escaped = raw.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Asserts table/field names are safe for deterministic rendering (no injection, no empty).
 */
export function assertSafeSchemaIdentifier(raw: string, kind: string): void {
  if (raw.trim().length === 0) {
    throw new UnsafeIdentifierError(raw, `empty ${kind} name`);
  }
  if (CONTROL_RE.test(raw)) {
    throw new UnsafeIdentifierError(raw, `control characters in ${kind} name`);
  }
  if (raw.includes(';')) {
    throw new UnsafeIdentifierError(raw, `semicolon in ${kind} name`);
  }
}
