/** Thrown when manual and/or Zod validation fails for generated schema JSON. */
export class GeneratedSchemaValidationError extends Error {
  readonly issues: string[];

  constructor(issues: string[]) {
    super(issues.join('; '));
    this.name = 'GeneratedSchemaValidationError';
    this.issues = issues;
  }
}
