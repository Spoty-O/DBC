import {
  extractFirstJsonObject,
  parseLlmJsonResponse,
} from './parse-llm-json.util';
import { LlmJsonParseError } from './llm-json-parse.error';
import { VALID_MINIMAL_SCHEMA_JSON } from './test-fixtures';

describe('parseLlmJsonResponse', () => {
  it('parses valid JSON immediately', () => {
    const data = parseLlmJsonResponse(VALID_MINIMAL_SCHEMA_JSON);
    expect(typeof data).toBe('object');
    expect(data).toEqual(JSON.parse(VALID_MINIMAL_SCHEMA_JSON));
  });

  it('unwraps markdown ```json fences', () => {
    const wrapped = `\`\`\`json\n${VALID_MINIMAL_SCHEMA_JSON}\n\`\`\``;
    const data = parseLlmJsonResponse(wrapped);
    expect(data).toEqual(JSON.parse(VALID_MINIMAL_SCHEMA_JSON));
  });

  it('extracts JSON object embedded in preamble text', () => {
    const raw = `Here is the schema:\n${VALID_MINIMAL_SCHEMA_JSON}\nThanks.`;
    const data = parseLlmJsonResponse(raw);
    expect(data).toEqual(JSON.parse(VALID_MINIMAL_SCHEMA_JSON));
  });

  it('throws structured error for invalid JSON without extractable object', () => {
    expect(() => parseLlmJsonResponse('not json {{{')).toThrow(LlmJsonParseError);
    try {
      parseLlmJsonResponse('no braces at all');
    } catch (e) {
      expect(e).toBeInstanceOf(LlmJsonParseError);
      expect((e as LlmJsonParseError).reason).toBe('no_json_object');
    }
  });
});

describe('extractFirstJsonObject', () => {
  it('returns null when there is no object', () => {
    expect(extractFirstJsonObject('[]')).toBeNull();
  });
});
