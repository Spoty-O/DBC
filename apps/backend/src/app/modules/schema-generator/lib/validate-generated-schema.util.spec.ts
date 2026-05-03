import { GeneratedSchemaValidationError } from './generated-schema-validation.error';
import { formatValidationErrors, validateGeneratedSchema } from './validate-generated-schema.util';

describe('validateGeneratedSchema', () => {
  it('accepts a valid minimal schema object', () => {
    const out = validateGeneratedSchema({
      tables: [
        {
          name: 'users',
          fields: [
            {
              name: 'id',
              type: 'uuid',
              nullable: false,
              primary: true,
              unique: false,
            },
          ],
        },
      ],
    });
    expect(out.tables[0].name).toBe('users');
  });

  it('runs manual structural checks (null rejection)', () => {
    expect(() => validateGeneratedSchema(null)).toThrow(
      GeneratedSchemaValidationError,
    );
    try {
      validateGeneratedSchema(null);
    } catch (e) {
      expect((e as GeneratedSchemaValidationError).issues.some((i) =>
        i.includes('non-null'),
      )).toBe(true);
    }
  });

  it('runs Zod when manual shape broadly passes but field type is invalid', () => {
    expect(() =>
      validateGeneratedSchema({
        tables: [
          {
            name: 'users',
            fields: [
              {
                name: 'id',
                type: 'bogus',
                nullable: false,
                primary: true,
                unique: false,
              },
            ],
          },
        ],
      }),
    ).toThrow(GeneratedSchemaValidationError);
  });

  it('runs Zod for missing required field props', () => {
    expect(() =>
      validateGeneratedSchema({
        tables: [
          {
            name: 'users',
            fields: [{ name: 'id', type: 'uuid', nullable: false }],
          },
        ],
      }),
    ).toThrow(GeneratedSchemaValidationError);
  });

  it('merges duplicate signals into deduped issues', () => {
    try {
      validateGeneratedSchema({ tables: [] });
    } catch (e) {
      expect(e).toBeInstanceOf(GeneratedSchemaValidationError);
      const merged = [...new Set((e as GeneratedSchemaValidationError).issues)];
      expect(merged.length).toBe((e as GeneratedSchemaValidationError).issues.length);
    }
  });
});

describe('formatValidationErrors', () => {
  it('formats numbered errors', () => {
    expect(formatValidationErrors(['a', 'b'])).toContain('1. a');
    expect(formatValidationErrors(['a', 'b'])).toContain('2. b');
  });
});
