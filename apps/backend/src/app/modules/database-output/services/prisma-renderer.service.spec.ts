import { PrismaRendererService } from './prisma-renderer.service';
import { usersPostsSchema } from '../test-fixtures';

describe('PrismaRendererService', () => {
  const svc = new PrismaRendererService();

  it('emits datasource, generator, and models', () => {
    const { code } = svc.render(usersPostsSchema);
    expect(code).toContain('datasource db');
    expect(code).toContain('model Users');
    expect(code).toContain('model Posts');
  });

  it('declares @relation with fields and references', () => {
    const { code } = svc.render(usersPostsSchema);
    expect(code).toContain('@relation(fields: [user_id], references: [id])');
  });

  it('maps tables with @@map', () => {
    const { code } = svc.render(usersPostsSchema);
    expect(code).toContain('@@map("users")');
    expect(code).toContain('@@map("posts")');
  });
});
