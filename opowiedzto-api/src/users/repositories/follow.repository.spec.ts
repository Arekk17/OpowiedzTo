import { DataSource, EntityManager } from 'typeorm';

import { FollowRepository } from './follow.repository';

const createRepository = () => {
  const manager = {
    findOne: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
  } as unknown as EntityManager;

  const dataSource = {
    createEntityManager: () => manager,
  } as unknown as DataSource;

  const repository = new FollowRepository(dataSource);
  return { repository, manager };
};

describe('FollowRepository', () => {
  it('wyszukuje relację follower-following', async () => {
    const { repository, manager } = createRepository();
    await repository.findByFollowerAndFollowing('follower', 'following');

    expect(manager.findOne).toHaveBeenCalledWith({
      where: { followerId: 'follower', followingId: 'following' },
    });
  });

  it('pobiera followersów z detalami', async () => {
    const { repository, manager } = createRepository();
    await repository.findFollowersWithDetails('user');

    expect(manager.find).toHaveBeenCalledWith({
      where: { followingId: 'user' },
      relations: ['follower'],
    });
  });

  it('pobiera obserwowanych z detalami', async () => {
    const { repository, manager } = createRepository();
    await repository.findFollowingWithDetails('user');

    expect(manager.find).toHaveBeenCalledWith({
      where: { followerId: 'user' },
      relations: ['following'],
    });
  });

  it('zlicza followersów', async () => {
    const { repository, manager } = createRepository();
    await repository.countFollowers('user');

    expect(manager.count).toHaveBeenCalledWith({ where: { followingId: 'user' } });
  });

  it('zlicza following', async () => {
    const { repository, manager } = createRepository();
    await repository.countFollowing('user');

    expect(manager.count).toHaveBeenCalledWith({ where: { followerId: 'user' } });
  });
});



