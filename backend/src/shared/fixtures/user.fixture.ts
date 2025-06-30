import { randomUUID } from 'crypto';
import { IUser } from '../interfaces';
import { hashSync } from 'bcryptjs';
import { authFixture } from './auth.fixture';

export const userFixture: IUser = {
  id: randomUUID(),
  email: authFixture.email,
  password: hashSync(authFixture.password, 10),
};
