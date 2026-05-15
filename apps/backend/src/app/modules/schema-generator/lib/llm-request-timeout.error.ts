/** Raised when a single Groq HTTP call exceeds the configured timeout. */
export class LlmRequestTimeoutError extends Error {
  constructor(public readonly timeoutMs: number) {
    super(`LLM request timed out after ${timeoutMs}ms`);
    this.name = 'LlmRequestTimeoutError';
  }
}
