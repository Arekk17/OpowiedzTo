import { DataSource, EntityManager } from 'typeorm';

import { CommentRepository } from './comment.repository';

const createRepository = () => {
  const manager = {
    find: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
  } as unknown as EntityManager;

  const dataSource = {
    createEntityManager: () => manager,
  } as unknown as DataSource;

  const repository = new CommentRepository(dataSource);
  return { repository, manager };
};

describe('CommentRepository', () => {
  it('ogranicza limit komentarzy do 10', async () => {
    const { repository, manager } = createRepository();
    (manager.find as jest.Mock).mockResolvedValue([]);

    await repository.findByPost('post', 50);

    expect(manager.find).toHaveBeenCalledWith({
      where: { postId: 'post' },
      relations: ['author'],
      order: { createdAt: 'DESC' },
      take: 10,
    });
  });

  it('pobiera komentarz wraz z autorem', async () => {
    const { repository, manager } = createRepository();
    await repository.findWithAuthor('comment');

    expect(manager.findOne).toHaveBeenCalledWith({
      where: { id: 'comment' },
      relations: ['author'],
    });
  });

  it('zlicza komentarze', async () => {
    const { repository, manager } = createRepository();
    await repository.countComments('post');

    expect(manager.count).toHaveBeenCalledWith({ where: { postId: 'post' } });
  });
});



