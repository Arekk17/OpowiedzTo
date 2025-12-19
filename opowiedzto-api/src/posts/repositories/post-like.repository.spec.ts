import { DataSource, EntityManager } from 'typeorm';

import { PostLikeRepository } from './post-like.repository';

const createRepository = () => {
  const manager = {
    findOne: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
  } as unknown as EntityManager;

  const dataSource = {
    createEntityManager: () => manager,
  } as unknown as DataSource;

  const repository = new PostLikeRepository(dataSource);
  return { repository, manager };
};

describe('PostLikeRepository', () => {
  it('wyszukuje polubienie po użytkowniku i poście', async () => {
    const { repository, manager } = createRepository();
    await repository.findByUserAndPost('user', 'post');

    expect(manager.findOne).toHaveBeenCalledWith({ where: { userId: 'user', postId: 'post' } });
  });

  it('pobiera polubienia z użytkownikami', async () => {
    const { repository, manager } = createRepository();
    await repository.findLikesWithUsers('post');

    expect(manager.find).toHaveBeenCalledWith({
      where: { postId: 'post' },
      relations: ['user'],
    });
  });

  it('zlicza polubienia', async () => {
    const { repository, manager } = createRepository();
    await repository.countLikes('post');

    expect(manager.count).toHaveBeenCalledWith({ where: { postId: 'post' } });
  });
});



