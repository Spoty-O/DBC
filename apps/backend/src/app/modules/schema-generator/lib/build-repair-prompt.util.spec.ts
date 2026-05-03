import { buildRepairPrompt } from './build-repair-prompt.util';
import { DATABASE_SCHEMA_JSON_DESCRIPTION } from './schema-description';

describe('buildRepairPrompt', () => {
  it('includes user prompt, invalid response chunk, errors, and schema expectation', () => {
    const p = buildRepairPrompt({
      userPrompt: 'Build a CRM',
      invalidResponse: '{ broken',
      errors: '1. syntax error',
    });
    expect(p).toContain('Build a CRM');
    expect(p).toContain('{ broken');
    expect(p).toContain('1. syntax error');
    expect(p).toContain(DATABASE_SCHEMA_JSON_DESCRIPTION.slice(0, 40));
    expect(p).toContain('Return ONLY valid JSON');
  });
});
