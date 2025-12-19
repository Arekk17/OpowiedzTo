import { DataSource } from 'typeorm';

import { PostsRepository } from './posts.repository';
import { Post } from '../entities/post.entity';
import { Comment } from '../entities/comment.entity';
import { PostLike } from '../entities/post-like.entity';

const createRepository = () => {
  const postRepo = {
    increment: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const commentRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const likeRepo = {
    findOne: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    increment: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const dataSource = {
    getRepository: jest.fn((entity) => {
      if (entity === Post) return postRepo;
      if (entity === Comment) return commentRepo;
      return likeRepo;
    }),
  } as unknown as DataSource;

  const repository = new PostsRepository(dataSource);
  return { repository, postRepo, commentRepo, likeRepo };
};

describe('PostsRepository', () => {
  it('inkrementuje liczbę polubień', async () => {
    const { repository, postRepo } = createRepository();
    await repository.incrementLikesCount('post-1', 2);

    expect(postRepo.increment).toHaveBeenCalledWith({ id: 'post-1' }, 'likesCount', 2);
  });

  it('tworzy post i zapisuje go', async () => {
    const { repository, postRepo } = createRepository();
    const post = { id: 'post-1' } as Post;
    postRepo.create.mockReturnValue(post);
    postRepo.save.mockResolvedValue(post);

    await expect(repository.create({ title: 'test' })).resolves.toBe(post);
    expect(postRepo.create).toHaveBeenCalledWith({ title: 'test' });
    expect(postRepo.save).toHaveBeenCalledWith(post);
  });

  it('wyszukuje polubienie po użytkowniku i poście', async () => {
    const { repository, likeRepo } = createRepository();
    likeRepo.findOne.mockResolvedValue({ id: 'like-1' });

    await expect(repository.findLikeByUserAndPost('user', 'post')).resolves.toEqual({
      id: 'like-1',
    });
    expect(likeRepo.findOne).toHaveBeenCalledWith({ where: { userId: 'user', postId: 'post' } });
  });
});



