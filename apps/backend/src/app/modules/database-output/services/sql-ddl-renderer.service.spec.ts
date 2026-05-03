import { SqlDdlRendererService } from './sql-ddl-renderer.service';
import { usersPostsSchema } from '../test-fixtures';

describe('SqlDdlRendererService', () => {
  const svc = new SqlDdlRendererService();

  it('emits CREATE TABLE for each table', () => {
    const { sql } = svc.render(usersPostsSchema);
    expect(sql).toContain('CREATE TABLE');
    expect(sql).toMatch(/"users"/);
    expect(sql).toMatch(/"posts"/);
  });

  it('emits PRIMARY KEY and FOREIGN KEY references', () => {
    const { sql } = svc.render(usersPostsSchema);
    expect(sql).toContain('PRIMARY KEY');
    expect(sql).toContain('REFERENCES');
    expect(sql).toContain('"users"');
  });

  it('creates indexes on foreign key columns', () => {
    const { sql } = svc.render(usersPostsSchema);
    expect(sql).toContain('CREATE INDEX');
    expect(sql).toContain('"user_id"');
  });

  it('adds CHECK for integer age column', () => {
    const { sql } = svc.render(usersPostsSchema);
    expect(sql).toContain('CHECK');
    expect(sql).toContain('"age"');
  });
});
