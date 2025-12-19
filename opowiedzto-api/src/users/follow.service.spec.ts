import { BadRequestException, NotFoundException } from '@nestjs/common';

import { FollowService } from './follow.service';
import { FollowRepository } from './repositories/follow.repository';
import { UserRepository } from './repositories/user.repository';
import { Follow } from './entities/follow.entity';
import { User } from './entities/user.entity';
import {
  createMockRepository,
  MockRepository,
} from '../../test/utils/create-mock-repository';

type MockFollowRepo = MockRepository<Follow> & {
  findByFollowerAndFollowing: jest.Mock<
    Promise<Follow | null>,
    [string, string]
  >;
  findFollowersWithDetails: jest.Mock<Promise<Follow[]>, [string]>;
  findFollowingWithDetails: jest.Mock<Promise<Follow[]>, [string]>;
  countFollowers: jest.Mock<Promise<number>, [string]>;
  countFollowing: jest.Mock<Promise<number>, [string]>;
};

type MockUserRepo = MockRepository<User>;

const createFollow = (overrides: Partial<Follow> = {}): Follow =>
  ({
    id: overrides.id ?? 'follow-id',
    followerId: overrides.followerId ?? 'follower-1',
    followingId: overrides.followingId ?? 'user-2',
    createdAt: overrides.createdAt ?? new Date(),
    follower: overrides.follower ?? ({ id: 'follower-1' } as User),
    following: overrides.following ?? ({ id: 'user-2' } as User),
  }) as Follow;

const createUser = (id: string): User =>
  ({
    id,
  }) as User;

describe('FollowService', () => {
  let service: FollowService;
  let followRepository: MockFollowRepo;
  let userRepository: MockUserRepo;

  beforeEach(() => {
    followRepository = {
      ...createMockRepository<Follow>(),
      findByFollowerAndFollowing: jest.fn(),
      findFollowersWithDetails: jest.fn(),
      findFollowingWithDetails: jest.fn(),
      countFollowers: jest.fn(),
      countFollowing: jest.fn(),
    };

    userRepository = createMockRepository<User>();

    service = new FollowService(
      followRepository as unknown as FollowRepository,
      userRepository as unknown as UserRepository,
    );
  });

  describe('followUser', () => {
    it('rzuca błąd przy próbie obserwacji samego siebie', async () => {
      await expect(
        service.followUser('user-1', 'user-1'),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('rzuca NotFound, gdy użytkownik nie istnieje', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        service.followUser('user-1', 'user-2'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('rzuca BadRequest, gdy relacja już istnieje', async () => {
      userRepository.findOne.mockResolvedValue(createUser('user-2'));
      followRepository.findByFollowerAndFollowing.mockResolvedValue(
        createFollow(),
      );

      await expect(
        service.followUser('user-1', 'user-2'),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('tworzy nową relację follow', async () => {
      const saved = createFollow({
        followerId: 'user-1',
        followingId: 'user-2',
      });
      userRepository.findOne.mockResolvedValue(createUser('user-2'));
      followRepository.findByFollowerAndFollowing.mockResolvedValue(null);
      followRepository.create.mockImplementation((value) => value as Follow);
      followRepository.save.mockResolvedValue(saved);

      const result = await service.followUser('user-1', 'user-2');

      expect(followRepository.create).toHaveBeenCalledWith({
        followerId: 'user-1',
        followingId: 'user-2',
      });
      expect(followRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          followerId: 'user-1',
          followingId: 'user-2',
        }),
      );
      expect(result).toBe(saved);
    });
  });

  describe('unfollowUser', () => {
    it('rzuca NotFound, gdy relacja nie istnieje', async () => {
      followRepository.findByFollowerAndFollowing.mockResolvedValue(null);

      await expect(
        service.unfollowUser('user-1', 'user-2'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('usuwa relację follow', async () => {
      const follow = createFollow({
        followerId: 'user-1',
        followingId: 'user-2',
      });
      followRepository.findByFollowerAndFollowing.mockResolvedValue(follow);
      followRepository.remove.mockResolvedValue(follow);

      await service.unfollowUser('user-1', 'user-2');

      expect(followRepository.remove).toHaveBeenCalledWith(follow);
    });
  });

  it('getFollowers zwraca listę obserwujących', async () => {
    const followers = [
      createFollow({ follower: createUser('follower-1') }),
      createFollow({ follower: createUser('follower-2') }),
    ];
    followRepository.findFollowersWithDetails.mockResolvedValue(followers);

    const result = await service.getFollowers('user-2');

    expect(result).toEqual([followers[0].follower, followers[1].follower]);
  });

  it('getFollowing zwraca listę obserwowanych', async () => {
    const following = [
      createFollow({ following: createUser('target-1') }),
      createFollow({ following: createUser('target-2') }),
    ];
    followRepository.findFollowingWithDetails.mockResolvedValue(following);

    const result = await service.getFollowing('user-1');

    expect(result).toEqual([following[0].following, following[1].following]);
  });

  it('getFollowersCount deleguje do repozytorium', async () => {
    followRepository.countFollowers.mockResolvedValue(5);

    await expect(service.getFollowersCount('user-1')).resolves.toBe(5);
    expect(followRepository.countFollowers).toHaveBeenCalledWith('user-1');
  });

  it('getFollowingCount deleguje do repozytorium', async () => {
    followRepository.countFollowing.mockResolvedValue(3);

    await expect(service.getFollowingCount('user-1')).resolves.toBe(3);
    expect(followRepository.countFollowing).toHaveBeenCalledWith('user-1');
  });
});
