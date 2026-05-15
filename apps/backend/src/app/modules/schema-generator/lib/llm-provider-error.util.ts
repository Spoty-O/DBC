export type ProviderErrorKind =
  | 'rate_limit'
  | 'timeout'
  | 'unavailable'
  | 'client'
  | 'unknown';

export function getProviderHttpStatus(err: unknown): number | undefined {
  if (err && typeof err === 'object') {
    const status = (err as { status?: unknown }).status;
    if (typeof status === 'number') {
      return status;
    }
  }
  return undefined;
}

export function getProviderErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  return String(err);
}

export function classifyProviderError(err: unknown): ProviderErrorKind {
  const status = getProviderHttpStatus(err);
  const msg = getProviderErrorMessage(err).toLowerCase();

  if (status === 429 || msg.includes('rate limit') || msg.includes('too many requests')) {
    return 'rate_limit';
  }
  if (
    status === 408 ||
    msg.includes('timeout') ||
    msg.includes('timed out') ||
    err instanceof Error && err.name === 'TimeoutError'
  ) {
    return 'timeout';
  }
  if (
    status === 503 ||
    status === 502 ||
    status === 500 ||
    msg.includes('unavailable') ||
    msg.includes('overloaded')
  ) {
    return 'unavailable';
  }
  if (status !== undefined && status >= 400 && status < 500) {
    return 'client';
  }
  return 'unknown';
}

export function isTransientProviderError(err: unknown): boolean {
  const kind = classifyProviderError(err);
  return kind === 'rate_limit' || kind === 'unavailable';
}
