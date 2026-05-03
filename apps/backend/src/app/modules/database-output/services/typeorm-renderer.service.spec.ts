import { TypeOrmRendererService } from './typeorm-renderer.service';
import { usersPostsSchema } from '../test-fixtures';

describe('TypeOrmRendererService', () => {
  const svc = new TypeOrmRendererService();

  it('emits @Entity and TypeScript class per table', () => {
    const { code } = svc.render(usersPostsSchema);
    expect(code).toContain("@Entity('users')");
    expect(code).toContain('export class Users');
    expect(code).toContain('export class Posts');
  });

  it('uses expected decorators for keys and relations', () => {
    const { code } = svc.render(usersPostsSchema);
    expect(code).toContain('@PrimaryGeneratedColumn');
    expect(code).toContain('@ManyToOne');
    expect(code).toContain('@OneToMany');
    expect(code).toContain('@JoinColumn');
    expect(code).toContain('@Index');
    expect(code).toContain('@Unique');
  });
});
