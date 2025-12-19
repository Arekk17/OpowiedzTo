import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { Repository, UpdateResult } from 'typeorm';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RefreshToken } from './entities/refresh-token.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Gender, User } from '../users/entities/user.entity';
import {
  createMockRepository,
  MockRepository,
} from '../../test/utils/create-mock-repository';
import { createMockJwtService } from '../../test/utils/mock-providers';

const freezeTime = (value: number) => {
  jest.spyOn(Date, 'now').mockReturnValue(value).mockName('Date.now');
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<Pick<UsersService, 'findByEmail' | 'create' | 'generateUniqueNickname'>>;
  let jwtService: jest.Mocked<JwtService>;
  let refreshTokenRepository: MockRepository<RefreshToken>;
  let response: Response;
  let request: Request;

  const userFactory = (overrides: Partial<User> = {}): User => ({
    id: overrides.id ?? 'user-id',
    email: overrides.email ?? 'john@example.com',
    password: overrides.password ?? 'hashed-password',
    nickname: overrides.nickname ?? 'johnny',
    gender: overrides.gender ?? Gender.OTHER,
    createdAt: overrides.createdAt ?? new Date(),
    updatedAt: overrides.updatedAt ?? new Date(),
    avatar: overrides.avatar ?? null,
    following: overrides.following ?? [],
    followers: overrides.followers ?? [],
    posts: overrides.posts ?? [],
    comments: overrides.comments ?? [],
    likes: overrides.likes ?? [],
    hashPassword: overrides.hashPassword ?? (async () => {}),
    validatePassword:
      overrides.validatePassword ?? jest.fn(() => Promise.resolve(true)),
  } as unknown as User);

  beforeEach(() => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      generateUniqueNickname: jest.fn(),
    } as jest.Mocked<Pick<UsersService, 'findByEmail' | 'create' | 'generateUniqueNickname'>>;

    const jwtMock = createMockJwtService();
    jwtService = {
      ...jwtMock,
      sign: jest.fn().mockImplementation((payload: unknown, options?: unknown) =>
        options ? 'refresh-token' : 'access-token',
      ),
      signAsync: jest.fn(jwtMock.signAsync),
      verifyAsync: jwtMock.verifyAsync,
      decode: jest.fn(),
      verify: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    refreshTokenRepository = createMockRepository<RefreshToken>();
    refreshTokenRepository.create.mockImplementation((value) => ({
      ...(value as RefreshToken),
      id: 'refresh-id',
      isRevoked: false,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    }));
    refreshTokenRepository.save.mockImplementation(async (value) => ({
      ...(value as RefreshToken),
      id: 'refresh-id',
      createdAt: new Date('2024-01-02T00:00:00.000Z'),
      isRevoked: false,
    }));
    refreshTokenRepository.update.mockResolvedValue({} as UpdateResult);

    response = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    } as unknown as Response;

    request = {
      get: jest.fn().mockReturnValue('Mozilla'),
      ip: '127.0.0.1',
    } as unknown as Request;

    service = new AuthService(
      usersService as unknown as UsersService,
      jwtService,
      refreshTokenRepository as unknown as Repository<RefreshToken>,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('register', () => {
    it('tworzy użytkownika, generuje tokeny i ustawia ciasteczka', async () => {
      const dto: RegisterDto = {
        email: 'john@example.com',
        password: 'secret',
        nickname: 'johnny',
        gender: Gender.MALE,
      };
      const user = userFactory();
      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(user);

      freezeTime(1700000000000);

      const result = await service.register(dto, response, request);

      expect(usersService.findByEmail).toHaveBeenCalledWith('john@example.com');
      expect(usersService.create).toHaveBeenCalledWith(
        'john@example.com',
        'secret',
        'johnny',
        Gender.MALE,
      );
      expect(refreshTokenRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'user-id', userAgent: 'Mozilla', ipAddress: '127.0.0.1' }),
      );
      expect(refreshTokenRepository.save).toHaveBeenCalled();
      expect(refreshTokenRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'user-id', isRevoked: false }),
        expect.objectContaining({ isRevoked: true }),
      );
      expect(response.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refresh-token',
        expect.objectContaining({ httpOnly: true }),
      );
      expect(response.cookie).toHaveBeenCalledWith(
        'accessToken',
        'access-token',
        expect.objectContaining({ httpOnly: true }),
      );
      expect(result).toEqual(
        expect.objectContaining({
          accessToken: 'access-token',
          userId: 'user-id',
          nickname: 'johnny',
          expiresAt: 1700000000000 + 15 * 60 * 1000,
          serverTime: 1700000000000,
        }),
      );
    });

    it('rzuca ConflictException, jeśli email jest zajęty', async () => {
      usersService.findByEmail.mockResolvedValue(userFactory());

      await expect(
        service.register(
          {
            email: 'john@example.com',
            password: 'secret',
            nickname: 'johnny',
            gender: Gender.MALE,
          },
          response,
          request,
        ),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(usersService.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('zwraca token dla poprawnego użytkownika', async () => {
      const dto: LoginDto = { email: 'john@example.com', password: 'secret' };
      const user = userFactory();
      usersService.findByEmail.mockResolvedValue(user);

      const result = await service.login(dto, response, request);

      expect(user.validatePassword).toHaveBeenCalledWith('secret');
      expect(response.cookie).toHaveBeenCalledWith(
        'accessToken',
        'access-token',
        expect.any(Object),
      );
      expect(result.accessToken).toBe('access-token');
    });

    it('rzuca UnauthorizedException, jeśli użytkownik nie istnieje', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'missing@example.com', password: 'secret' }, response, request),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rzuca UnauthorizedException przy błędnym haśle', async () => {
      const user = userFactory({
        validatePassword: jest.fn(() => Promise.resolve(false)),
      });
      usersService.findByEmail.mockResolvedValue(user);

      await expect(
        service.login({ email: 'john@example.com', password: 'wrong' }, response, request),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('unieważnia refresh token i czyści ciasteczka', async () => {
      const user = userFactory();

      const result = await service.logout(user, response);

      expect(refreshTokenRepository.update).toHaveBeenCalledWith(
        { userId: 'user-id', isRevoked: false },
        expect.objectContaining({ isRevoked: true }),
      );
      expect(response.clearCookie).toHaveBeenCalledWith(
        'accessToken',
        expect.objectContaining({ httpOnly: true }),
      );
      expect(response.clearCookie).toHaveBeenCalledWith(
        'refreshToken',
        expect.objectContaining({ httpOnly: true }),
      );
      expect(result).toEqual({ message: 'Wylogowano pomyślnie' });
    });
  });

  describe('generateRefreshToken', () => {
    it('tworzy i zwraca refresh token', async () => {
      const user = userFactory();

      const token = await service.generateRefreshToken(user, 'Mozilla', '127.0.0.1');

      expect(refreshTokenRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'user-id', userAgent: 'Mozilla', ipAddress: '127.0.0.1' }),
      );
      expect(refreshTokenRepository.save).toHaveBeenCalled();
      expect(token).toBe('refresh-token');
    });

    it('rzuca InternalServerErrorException przy błędzie zapisu', async () => {
      const user = userFactory();
      refreshTokenRepository.save.mockRejectedValue(new Error('db error'));

      await expect(service.generateRefreshToken(user)).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });

  describe('generateNickname', () => {
    it('zwraca wygenerowany nick', async () => {
      usersService.generateUniqueNickname.mockResolvedValue('nick-123');

      await expect(service.generateNickname()).resolves.toBe('nick-123');
    });

    it('propaguje ConflictException', async () => {
      usersService.generateUniqueNickname.mockRejectedValue(new ConflictException());

      await expect(service.generateNickname()).rejects.toBeInstanceOf(ConflictException);
    });

    it('opakowuje inne błędy w InternalServerErrorException', async () => {
      usersService.generateUniqueNickname.mockRejectedValue(new Error('unknown'));

      await expect(service.generateNickname()).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });

  describe('refreshTokens', () => {
    it('generuje nowy access token i ustawia ciasteczko', () => {
      const user = userFactory();

      const result = service.refreshTokens(user, response);

      expect(response.cookie).toHaveBeenCalledWith(
        'accessToken',
        'access-token',
        expect.any(Object),
      );
      expect(result.accessToken).toBe('access-token');
    });
  });
});

