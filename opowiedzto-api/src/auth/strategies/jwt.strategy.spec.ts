import { UnauthorizedException } from '@nestjs/common';

import { JwtStrategy } from './jwt.strategy';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { User } from '../../users/entities/user.entity';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(() => {
    usersService = {
      findOne: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    strategy = new JwtStrategy(usersService);
  });

  it('zwraca użytkownika przy poprawnym payloadzie', async () => {
    const user = { id: 'user-1' } as User;
    usersService.findOne.mockResolvedValue(user);

    const payload: JwtPayload = {
      userId: 'user-1',
      email: 'john@example.com',
      nickname: 'johnny',
    };

    await expect(strategy.validate(payload)).resolves.toBe(user);
    expect(usersService.findOne).toHaveBeenCalledWith('user-1');
  });

  it('rzuca UnauthorizedException, gdy użytkownik nie istnieje', async () => {
    usersService.findOne.mockResolvedValue(null as unknown as User);

    await expect(
      strategy.validate({ userId: 'missing', email: '', nickname: '' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});



