export async function sleep(ms: number): Promise<void> {
  if (ms <= 0) {
    return;
  }
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  onTimeout: () => Error,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(onTimeout()), timeoutMs);
      }),
    ]);
  } finally {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  }
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    attempts: number;
    delayMs: number;
    isRetryable: (err: unknown) => boolean;
    onRetry?: (err: unknown, attempt: number) => void;
  },
): Promise<T> {
  const maxAttempts = Math.max(1, options.attempts);
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const canRetry =
        attempt < maxAttempts && options.isRetryable(err);
      if (!canRetry) {
        throw err;
      }
      options.onRetry?.(err, attempt);
      await sleep(options.delayMs * attempt);
    }
  }

  throw lastError;
}
