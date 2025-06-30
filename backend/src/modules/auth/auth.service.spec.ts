import { TestBed, Mocked } from '@suites/unit';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { userFixture } from 'src/shared/fixtures';
import { authFixture } from 'src/shared/fixtures/auth.fixture';
import { JwtService } from '@nestjs/jwt';

describe('AuthService (Unit)', () => {
  let service: AuthService;
  let userService: Mocked<UserService>;
  let jwtService: Mocked<JwtService>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(AuthService).compile();

    service = unit;
    userService = unitRef.get(UserService);
    jwtService = unitRef.get(JwtService);
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  it('signUp: returns user when valid', async () => {
    userService.create.mockResolvedValue(userFixture);
    await expect(service.signUp(authFixture)).resolves.toEqual(userFixture);
  });

  it('signIn: returns tokens object when valid', async () => {
    jwtService.sign
      .mockReturnValueOnce('accessToken')
      .mockReturnValueOnce('refreshToken');
    await expect(service.signIn(userFixture, true)).resolves.toEqual({
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    });
  });

  it('refresh: returns accessToken when valid', async () => {
    jwtService.sign.mockReturnValueOnce('accessToken');
    await expect(service.refresh(userFixture)).resolves.toEqual({
      accessToken: 'accessToken',
    });
  });
});
