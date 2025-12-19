import { DataSource, EntityManager } from 'typeorm';

import { UserRepository } from './user.repository';

const createRepository = () => {
  const manager = {
    findOne: jest.fn(),
  } as unknown as EntityManager;

  const dataSource = {
    createEntityManager: () => manager,
  } as unknown as DataSource;

  const repository = new UserRepository(dataSource);
  return { repository, manager };
};

describe('UserRepository', () => {
  it('wyszukuje po emailu', async () => {
    const { repository, manager } = createRepository();
    (manager.findOne as jest.Mock).mockResolvedValue({ id: 'user-1' });

    await expect(repository.findByEmail('john@example.com')).resolves.toEqual({
      id: 'user-1',
    });
    expect(manager.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
  });

  it('wyszukuje po nicku', async () => {
    const { repository, manager } = createRepository();
    (manager.findOne as jest.Mock).mockResolvedValue({ id: 'user-1' });

    await repository.findByNickname('johnny');
    expect(manager.findOne).toHaveBeenCalledWith({ where: { nickname: 'johnny' } });
  });

  it('pobiera użytkownika z followersami', async () => {
    const { repository, manager } = createRepository();
    await repository.findWithFollowers('user-1');

    expect(manager.findOne).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      relations: ['followers', 'followers.follower'],
    });
  });

  it('pobiera użytkownika z obserwowanymi', async () => {
    const { repository, manager } = createRepository();
    await repository.findWithFollowing('user-1');

    expect(manager.findOne).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      relations: ['following', 'following.following'],
    });
  });
});



