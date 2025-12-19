import { Repository } from 'typeorm';

import { SeedService } from './seed.service';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';
import { Comment } from '../posts/entities/comment.entity';
import { PostLike } from '../posts/entities/post-like.entity';
import { TagsService } from '../tags/tags.service';
import { createMockRepository, MockRepository } from '../../test/utils/create-mock-repository';

describe('SeedService', () => {
  let postsRepository: MockRepository<Post>;
  let usersRepository: MockRepository<User>;
  let commentsRepository: MockRepository<Comment>;
  let postLikesRepository: MockRepository<PostLike>;
  let tagsService: jest.Mocked<TagsService>;
  let service: SeedService;

  const createdUsers: User[] = [];
  const createdPosts: Post[] = [];
  const createdComments: Comment[] = [];

  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);

    postsRepository = createMockRepository<Post>();
    usersRepository = createMockRepository<User>();
    commentsRepository = createMockRepository<Comment>();
    postLikesRepository = createMockRepository<PostLike>();

    tagsService = {
      upsertManyBySlugs: jest.fn(),
      findBySlugs: jest.fn(),
      incrementPostCount: jest.fn(),
    } as unknown as jest.Mocked<TagsService>;

    tagsService.upsertManyBySlugs.mockResolvedValue();
    tagsService.findBySlugs.mockResolvedValue([{ slug: 'tag' } as never]);
    tagsService.incrementPostCount.mockResolvedValue();

    usersRepository.count.mockResolvedValue(0);
    usersRepository.create.mockImplementation((data) => data as unknown as User);
    usersRepository.save.mockImplementation(async (user) => {
      const saved = { id: `user-${createdUsers.length + 1}`, ...user } as User;
      createdUsers.push(saved);
      return saved;
    });
    usersRepository.find.mockImplementation(async () => createdUsers);

    postsRepository.count.mockResolvedValue(0);
    postsRepository.create.mockImplementation((data) => data as unknown as Post);
    postsRepository.save.mockImplementation(async (post) => {
      const saved = { id: `post-${createdPosts.length + 1}`, ...post } as Post;
      createdPosts.push(saved);
      return saved;
    });
    postsRepository.find.mockImplementation(async () => createdPosts);
    postsRepository.update.mockResolvedValue({} as never);

    commentsRepository.create.mockImplementation((data) => data as unknown as Comment);
    commentsRepository.save.mockImplementation(async (comment) => {
      createdComments.push(comment as Comment);
      return comment as Comment;
    });

    postLikesRepository.findOne.mockResolvedValue(null);
    postLikesRepository.create.mockImplementation((data) => data as unknown as PostLike);
    postLikesRepository.save.mockResolvedValue({} as never);

    service = new SeedService(
      postsRepository as unknown as Repository<Post>,
      usersRepository as unknown as Repository<User>,
      commentsRepository as unknown as Repository<Comment>,
      postLikesRepository as unknown as Repository<PostLike>,
      tagsService,
    );
  });

  afterEach(() => {
    createdUsers.splice(0);
    createdPosts.splice(0);
    createdComments.splice(0);
    jest.restoreAllMocks();
  });

  it('nie seeduje, gdy dane już istnieją', async () => {
    usersRepository.count.mockResolvedValueOnce(5);
    postsRepository.count.mockResolvedValueOnce(2);

    await service.onApplicationBootstrap();

    expect(usersRepository.save).not.toHaveBeenCalled();
    expect(postsRepository.save).not.toHaveBeenCalled();
  });

  it('seeduje użytkowników i posty przy pustej bazie', async () => {
    tagsService.findBySlugs.mockResolvedValue([{ slug: 'tag' } as never]);

    await service.onApplicationBootstrap();

    expect(createdUsers).toHaveLength(20);
    expect(createdPosts).toHaveLength(40);
    expect(tagsService.upsertManyBySlugs).toHaveBeenCalled();
    expect(tagsService.incrementPostCount).toHaveBeenCalled();
    expect(postsRepository.update).toHaveBeenCalled();
  });
});

