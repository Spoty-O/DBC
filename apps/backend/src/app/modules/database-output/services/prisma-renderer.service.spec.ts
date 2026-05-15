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

  it('renames conflicting scalar/relation field names instead of failing', () => {
    const schema = {
      tables: [
        {
          name: 'customers',
          fields: [
            {
              name: 'id',
              type: 'uuid' as const,
              nullable: false,
              primary: true,
              unique: true,
            },
          ],
        },
        {
          name: 'orders',
          fields: [
            {
              name: 'id',
              type: 'uuid' as const,
              nullable: false,
              primary: true,
              unique: true,
            },
            {
              name: 'customer',
              type: 'string' as const,
              nullable: false,
              primary: false,
              unique: false,
            },
            {
              name: 'customer_id',
              type: 'uuid' as const,
              nullable: false,
              primary: false,
              unique: false,
              references: { table: 'customers', field: 'id' },
            },
          ],
        },
      ],
    };
    const { code, warnings } = svc.render(schema);
    expect(code).toContain('model Orders');
    expect(code).toContain('customerRelation');
    expect(warnings.some((w) => w.includes('renamed duplicate'))).toBe(true);
  });
});
