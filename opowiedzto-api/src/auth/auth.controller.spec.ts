import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Gender } from '../users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  const response = { cookie: jest.fn(), clearCookie: jest.fn() } as never;
  const request = { headers: {}, get: jest.fn(), ip: '127.0.0.1' } as never;

  beforeEach(() => {
    service = {
      register: jest.fn(),
      login: jest.fn(),
      refreshTokens: jest.fn(),
      generateNickname: jest.fn(),
      logout: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    controller = new AuthController(service);
  });

  it('register deleguje do AuthService', async () => {
    const dto: RegisterDto = {
      email: 'john@example.com',
      password: 'secret',
      nickname: 'johnny',
      gender: Gender.MALE,
    };
    const result = { accessToken: 'token' } as never;
    service.register.mockResolvedValue(result);

    await expect(controller.register(dto, response, request)).resolves.toBe(
      result,
    );
    expect(service.register).toHaveBeenCalledWith(dto, response, request);
  });

  it('login deleguje do AuthService', async () => {
    const dto: LoginDto = { email: 'john@example.com', password: 'secret' };
    service.login.mockResolvedValue({ accessToken: 'token' } as never);

    await controller.login(dto, response, request);

    expect(service.login).toHaveBeenCalledWith(dto, response, request);
  });

  it('refreshToken deleguje do AuthService', () => {
    const user = { id: 'user-1' } as never;
    controller.refreshToken(user, response);

    expect(service.refreshTokens).toHaveBeenCalledWith(user, response);
  });

  it('logout deleguje do AuthService', async () => {
    const user = { id: 'user-1' } as never;
    service.logout.mockResolvedValue({ message: 'ok' });

    await controller.logout(user, response);

    expect(service.logout).toHaveBeenCalledWith(user, response);
  });

  it('generateNickname zwraca wygenerowany nick', async () => {
    service.generateNickname.mockResolvedValue('nick-123');

    await expect(controller.generateNickname()).resolves.toEqual({
      nickname: 'nick-123',
    });
  });

  it('getProfile zwraca dane użytkownika', () => {
    const createdAt = new Date();
    const user = {
      id: 'user-1',
      email: 'john@example.com',
      nickname: 'johnny',
      createdAt,
    } as any;

    expect(controller.getProfile(user)).toEqual({
      id: 'user-1',
      email: 'john@example.com',
      nickname: 'johnny',
      createdAt,
    });
  });
});
