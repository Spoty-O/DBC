import { UnsafeIdentifierError } from '../errors/database-output.errors';
import { escapePgIdentifier } from './pg-identifier.util';

describe('escapePgIdentifier', () => {
  it('throws UnsafeIdentifierError for semicolon', () => {
    expect(() => escapePgIdentifier('bad;drop')).toThrow(UnsafeIdentifierError);
  });
});
