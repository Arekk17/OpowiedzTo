import { PostsService } from './posts.service';
import { PostLikeService } from './post-like.service';
import { PostLike } from './entities/post-like.entity';
import { User } from '../users/entities/user.entity';

describe('PostLikeService', () => {
  let postsService: jest.Mocked<PostsService>;
  let service: PostLikeService;

  const like = { id: 'like-id' } as unknown as PostLike;
  const users = [{ id: 'user-1' } as User];

  beforeEach(() => {
    postsService = {
      likePost: jest.fn(),
      unlikePost: jest.fn(),
      getLikes: jest.fn(),
      getLikeCount: jest.fn(),
    } as unknown as jest.Mocked<PostsService>;

    service = new PostLikeService(postsService);
  });

  it('deleguje likePost do PostsService', async () => {
    postsService.likePost.mockResolvedValue(like);

    await expect(service.likePost('user-1', 'post-1')).resolves.toBe(like);
    expect(postsService.likePost).toHaveBeenCalledWith('user-1', 'post-1');
  });

  it('deleguje unlikePost do PostsService', async () => {
    postsService.unlikePost.mockResolvedValue();

    await service.unlikePost('user-1', 'post-1');

    expect(postsService.unlikePost).toHaveBeenCalledWith('user-1', 'post-1');
  });

  it('deleguje getLikes do PostsService', async () => {
    postsService.getLikes.mockResolvedValue(users);

    await expect(service.getLikes('post-1')).resolves.toBe(users);
    expect(postsService.getLikes).toHaveBeenCalledWith('post-1');
  });

  it('deleguje getLikeCount do PostsService', async () => {
    postsService.getLikeCount.mockResolvedValue(5);

    await expect(service.getLikeCount('post-1')).resolves.toBe(5);
  });
});



