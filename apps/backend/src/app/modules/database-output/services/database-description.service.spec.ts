import { DatabaseDescriptionService } from './database-description.service';
import { usersPostsSchema } from '../test-fixtures';

describe('DatabaseDescriptionService', () => {
  const svc = new DatabaseDescriptionService();

  it('describeBrief names tables and FK cardinality', () => {
    const text = svc.describeBrief(usersPostsSchema);
    expect(text).toMatch(/2 table/i);
    expect(text).toMatch(/users|posts/);
    expect(text).toMatch(/foreign key|many-to-one|1:N/i);
  });
});
