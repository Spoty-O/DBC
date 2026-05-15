import { LlmConcurrencyLimiter } from './llm-concurrency.limiter';
import { CConfigService } from '../../../../config/env.service';

describe('LlmConcurrencyLimiter', () => {
  const config = {
    llmMaxConcurrentRequests: 2,
  } as CConfigService;

  it('allows at most N concurrent tasks', async () => {
    const limiter = new LlmConcurrencyLimiter(config);
    let active = 0;
    let maxActive = 0;

    const task = async () => {
      await limiter.run(async () => {
        active += 1;
        maxActive = Math.max(maxActive, active);
        await new Promise((r) => setTimeout(r, 50));
        active -= 1;
      });
    };

    await Promise.all([task(), task(), task(), task()]);
    expect(maxActive).toBeLessThanOrEqual(2);
  });
});
