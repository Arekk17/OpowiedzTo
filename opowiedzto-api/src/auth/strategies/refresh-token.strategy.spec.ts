import { UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { RefreshTokenStrategy } from './refresh-token.strategy';
import { UsersService } from '../../users/users.service';
import { RefreshToken } from '../entities/refresh-token.entity';
import { RefreshTokenPayload } from '../interfaces/refresh-token-payload.interface';
import { User } from '../../users/entities/user.entity';
import {
  createMockRepository,
  MockRepository,
} from '../../../test/utils/create-mock-repository';

describe('RefreshTokenStrategy', () => {
  let strategy: RefreshTokenStrategy;
  let usersService: jest.Mocked<UsersService>;
  let refreshTokenRepository: MockRepository<RefreshToken>;

  const validToken: RefreshToken = {
    id: 'token-1',
    userId: 'user-1',
    user: { id: 'user-1' } as User,
    expiresAt: new Date(Date.now() + 60_000),
    isRevoked: false,
    createdAt: new Date(),
    revokedAt: null,
    userAgent: 'agent',
    ipAddress: '127.0.0.1',
  } as RefreshToken;

  beforeEach(() => {
    usersService = {
      findOne: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    refreshTokenRepository = createMockRepository<RefreshToken>();
    refreshTokenRepository.findOne.mockResolvedValue(validToken);

    usersService.findOne.mockResolvedValue({ id: 'user-1' } as User);

    strategy = new RefreshTokenStrategy(
      usersService,
      refreshTokenRepository as unknown as Repository<RefreshToken>,
    );
  });

  const validPayload: RefreshTokenPayload = {
    tokenId: 'token-1',
    email: 'test@example.com',
    nickname: 'testuser',
  };

  it('zwraca użytkownika dla poprawnego refresh tokenu', async () => {
    await expect(strategy.validate(validPayload)).resolves.toEqual({
      id: 'user-1',
    });
    expect(refreshTokenRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'token-1', isRevoked: false },
    });
  });

  it('rzuca UnauthorizedException dla pustego tokenId', async () => {
    await expect(
      strategy.validate({
        tokenId: '',
        email: 'test@example.com',
        nickname: 'test',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rzuca UnauthorizedException, gdy token nie istnieje', async () => {
    refreshTokenRepository.findOne.mockResolvedValue(null);

    await expect(strategy.validate(validPayload)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('rzuca UnauthorizedException, gdy token wygasł', async () => {
    refreshTokenRepository.findOne.mockResolvedValue({
      ...validToken,
      expiresAt: new Date(Date.now() - 1_000),
    });

    await expect(strategy.validate(validPayload)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('rzuca UnauthorizedException, gdy użytkownik nie istnieje', async () => {
    usersService.findOne.mockResolvedValue(null as unknown as User);

    await expect(strategy.validate(validPayload)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('rzuca UnauthorizedException przy nieoczekiwanym błędzie', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    refreshTokenRepository.findOne.mockRejectedValue(new Error('db error'));

    await expect(strategy.validate(validPayload)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
