export type LlmJsonParseReason =
  | 'empty'
  | 'syntax'
  | 'no_json_object';

export class LlmJsonParseError extends Error {
  readonly reason: LlmJsonParseReason;

  constructor(reason: LlmJsonParseReason, message: string) {
    super(message);
    this.name = 'LlmJsonParseError';
    this.reason = reason;
  }
}
