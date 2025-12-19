import { ConflictException, NotFoundException } from '@nestjs/common';

import { UsersService } from './users.service';
import { UserRepository } from './repositories/user.repository';
import { User, Gender } from './entities/user.entity';
import {
  createMockRepository,
  MockRepository,
} from '../../test/utils/create-mock-repository';

type MockUserRepository = MockRepository<User> & {
  findByEmail: jest.Mock<Promise<User | null>, [string]>;
  findByNickname: jest.Mock<Promise<User | null>, [string]>;
};

const createUser = (overrides: Partial<User> = {}): User =>
  ({
    id: overrides.id ?? 'user-id',
    email: overrides.email ?? 'john@example.com',
    nickname: overrides.nickname ?? 'johnny',
    password: overrides.password ?? 'hashed',
    gender: overrides.gender ?? Gender.OTHER,
    avatar: overrides.avatar ?? null,
    createdAt: overrides.createdAt ?? new Date(),
    updatedAt: overrides.updatedAt ?? new Date(),
    comments: overrides.comments ?? [],
    likes: overrides.likes ?? [],
    posts: overrides.posts ?? [],
    followers: overrides.followers ?? [],
    following: overrides.following ?? [],
  }) as unknown as User;

describe('UsersService', () => {
  let service: UsersService;
  let repository: MockUserRepository;

  beforeEach(() => {
    repository = {
      ...createMockRepository<User>(),
      findByEmail: jest.fn(),
      findByNickname: jest.fn(),
    };

    service = new UsersService(repository as unknown as UserRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('findOne', () => {
    it('zwraca użytkownika, gdy istnieje', async () => {
      const user = createUser();
      repository.findOne.mockResolvedValue(user);

      await expect(service.findOne('user-id')).resolves.toBe(user);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-id' },
      });
    });

    it('rzuca NotFoundException, gdy użytkownik nie istnieje', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  it('findByEmail deleguje do repozytorium', async () => {
    const user = createUser();
    repository.findByEmail.mockResolvedValue(user);

    await expect(service.findByEmail('john@example.com')).resolves.toBe(user);
    expect(repository.findByEmail).toHaveBeenCalledWith('john@example.com');
  });

  describe('generateUniqueNickname', () => {
    it('zwraca unikalny nickname', async () => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0.1234);
      repository.findByNickname.mockResolvedValue(null);

      await expect(service.generateUniqueNickname()).resolves.toMatch(
        /^Anonymous\d{4}$/,
      );
      expect(repository.findByNickname).toHaveBeenCalledTimes(1);
    });

    it('rzuca ConflictException po przekroczeniu prób', async () => {
      jest
        .spyOn(global.Math, 'random')
        .mockReturnValueOnce(0.1)
        .mockReturnValue(0.2);
      repository.findByNickname.mockResolvedValue(createUser());

      await expect(service.generateUniqueNickname()).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(repository.findByNickname).toHaveBeenCalledTimes(10);
    });
  });

  describe('create', () => {
    it('generuje nickname, gdy nie przekazano', async () => {
      jest
        .spyOn(service, 'generateUniqueNickname')
        .mockResolvedValue('Anonymous1234');
      repository.create.mockImplementation((data) => data as User);
      repository.save.mockResolvedValue(
        createUser({ nickname: 'Anonymous1234' }),
      );

      const user = await service.create('john@example.com', 'secret');

      expect(service.generateUniqueNickname).toHaveBeenCalled();
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ nickname: 'Anonymous1234' }),
      );
      expect(user.nickname).toBe('Anonymous1234');
    });

    it('sprawdza dostępność nickname przy rejestracji', async () => {
      repository.findByNickname.mockResolvedValue(null);
      repository.create.mockImplementation((data) => data as User);
      repository.save.mockResolvedValue(createUser({ nickname: 'johnny' }));

      const user = await service.create(
        'john@example.com',
        'secret',
        'johnny',
        Gender.MALE,
      );

      expect(repository.findByNickname).toHaveBeenCalledWith('johnny');
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'john@example.com',
          nickname: 'johnny',
          gender: Gender.MALE,
        }),
      );
      expect(user.nickname).toBe('johnny');
    });

    it('rzuca ConflictException przy zajętym nicku', async () => {
      repository.findByNickname.mockResolvedValue(createUser({ id: 'other' }));

      await expect(
        service.create('john@example.com', 'secret', 'johnny', Gender.MALE),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('aktualizuje użytkownika', async () => {
      const user = createUser();
      repository.findOne.mockResolvedValue(user);
      repository.findByNickname.mockResolvedValue(null);
      repository.save.mockResolvedValue({
        ...user,
        nickname: 'newnick',
      } as User);

      const result = await service.update('user-id', { nickname: 'newnick' });

      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ nickname: 'newnick' }),
      );
      expect(result.nickname).toBe('newnick');
    });

    it('rzuca ConflictException gdy nickname zajęty przez innego użytkownika', async () => {
      const user = createUser();
      repository.findOne.mockResolvedValue(user);
      repository.findByNickname.mockResolvedValue(
        createUser({ id: 'someone-else' }),
      );

      await expect(
        service.update('user-id', { nickname: 'taken' }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  it('uploadAvatar zapisuje ścieżkę awatara', async () => {
    const user = createUser();
    repository.findOne.mockResolvedValue(user);
    repository.save.mockResolvedValue({
      ...user,
      avatar: 'avatar.png',
    } as User);

    await service.uploadAvatar('user-id', 'avatar.png');

    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({ avatar: 'avatar.png' }),
    );
  });

  it('updateAvatar zwraca zaktualizowanego użytkownika', async () => {
    const user = createUser();
    repository.findOne.mockResolvedValue(user);
    repository.save.mockResolvedValue({ ...user, avatar: 'new.png' } as User);

    const result = await service.updateAvatar('user-id', 'new.png');

    expect(result.avatar).toBe('new.png');
  });
});
