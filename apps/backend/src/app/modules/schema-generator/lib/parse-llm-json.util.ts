import { LlmJsonParseError, type LlmJsonParseReason } from './llm-json-parse.error';

function stripOuterCodeFences(raw: string): string {
  const trimmed = raw.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)\s*```$/i.exec(trimmed);
  if (fence?.[1]) {
    return fence[1].trim();
  }
  return trimmed;
}

/** Prefer inner ```json … ``` slice when present. */
function unwrapEmbeddedFences(text: string): string {
  const embedded = /```(?:json)?\s*([\s\S]*?)\s*```/i.exec(text);
  if (embedded?.[1]) {
    return embedded[1].trim();
  }
  return text;
}

/**
 * Extract first top-level JSON object substring using brace matching (string-aware).
 */
export function extractFirstJsonObject(text: string): string | null {
  const idx = text.indexOf('{');
  if (idx === -1) {
    return null;
  }
  let depth = 0;
  let inStr = false;
  let escape = false;
  for (let i = idx; i < text.length; i++) {
    const ch = text[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (inStr) {
      if (ch === '\\') {
        escape = true;
      } else if (ch === '"') {
        inStr = false;
      }
      continue;
    }
    if (ch === '"') {
      inStr = true;
      continue;
    }
    if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) {
        return text.slice(idx, i + 1);
      }
    }
  }
  return null;
}

function failParse(reason: LlmJsonParseReason, message: string): never {
  throw new LlmJsonParseError(reason, message);
}

/**
 * Remove markdown fences, isolate JSON from surrounding text, parse safely.
 * @throws LlmJsonParseError with structured reason
 */
export function parseLlmJsonResponse(raw: string): unknown {
  const trimmed = raw?.trim() ?? '';
  if (trimmed === '') {
    failParse('empty', 'Model returned an empty string');
  }
  let candidate = stripOuterCodeFences(trimmed);
  candidate = unwrapEmbeddedFences(candidate);

  let lastSyntaxError: LlmJsonParseError | null = null;
  const attempt = (label: string, s: string): unknown | null => {
    try {
      return JSON.parse(s) as unknown;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      lastSyntaxError = new LlmJsonParseError(
        'syntax',
        `${label}: JSON.parse failed: ${msg}`,
      );
      return null;
    }
  };

  const direct = attempt('Primary parse', candidate);
  if (direct !== null) {
    return direct;
  }

  const extracted = extractFirstJsonObject(candidate);
  if (extracted == null) {
    failParse(
      'no_json_object',
      lastSyntaxError?.message ??
        'Could not find a JSON object in the model response',
    );
  }

  const second = attempt('Bracket-extracted JSON', extracted);
  if (second !== null) {
    return second;
  }

  throw (
    lastSyntaxError ??
    new LlmJsonParseError('syntax', 'Invalid JSON in model response')
  );
}
