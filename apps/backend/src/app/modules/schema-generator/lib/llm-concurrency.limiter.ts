import { Injectable, Logger } from '@nestjs/common';
import { CConfigService } from '../../../../config/env.service';

/**
 * Limits how many LLM generation pipelines run at once (each may issue multiple Groq calls).
 */
@Injectable()
export class LlmConcurrencyLimiter {
  private readonly logger = new Logger(LlmConcurrencyLimiter.name);

  private active = 0;

  private readonly queue: Array<() => void> = [];

  private readonly maxConcurrent: number;

  constructor(config: CConfigService) {
    this.maxConcurrent = config.llmMaxConcurrentRequests;
  }

  get activeCount(): number {
    return this.active;
  }

  get queuedCount(): number {
    return this.queue.length;
  }

  async run<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }

  private acquire(): Promise<void> {
    if (this.active < this.maxConcurrent) {
      this.active += 1;
      return Promise.resolve();
    }
    this.logger.debug(
      `LLM slot full (${this.active}/${this.maxConcurrent}); queue depth ${this.queue.length + 1}`,
    );
    return new Promise((resolve) => {
      this.queue.push(() => {
        this.active += 1;
        resolve();
      });
    });
  }

  private release(): void {
    this.active -= 1;
    const next = this.queue.shift();
    if (next) {
      next();
    }
  }
}
