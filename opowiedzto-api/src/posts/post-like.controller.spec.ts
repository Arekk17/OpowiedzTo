import { PostLikeController } from './post-like.controller';
import { PostLikeService } from './post-like.service';
import { User } from '../users/entities/user.entity';

describe('PostLikeController', () => {
  let controller: PostLikeController;
  let service: jest.Mocked<PostLikeService>;

  beforeEach(() => {
    service = {
      likePost: jest.fn(),
      unlikePost: jest.fn(),
      getLikes: jest.fn(),
      getLikeCount: jest.fn(),
    } as unknown as jest.Mocked<PostLikeService>;

    controller = new PostLikeController(service);
  });

  it('likePost wywołuje serwis i zwraca komunikat', async () => {
    const user = { id: 'user-1' } as User;

    const result = await controller.likePost('post-1', user);

    expect(service.likePost).toHaveBeenCalledWith('user-1', 'post-1');
    expect(result).toEqual({ message: 'Post został polubiony' });
  });

  it('unlikePost deleguje do serwisu', async () => {
    const user = { id: 'user-1' } as User;

    await controller.unlikePost('post-1', user);

    expect(service.unlikePost).toHaveBeenCalledWith('user-1', 'post-1');
  });

  it('getLikes deleguje do serwisu', async () => {
    const likes = [{ id: 'user-2' } as User];
    service.getLikes.mockResolvedValue(likes);

    await expect(controller.getLikes('post-1')).resolves.toBe(likes);
  });

  it('getLikeCount zwraca wynik serwisu', async () => {
    service.getLikeCount.mockResolvedValue(2);

    await expect(controller.getLikeCount('post-1')).resolves.toEqual({ count: 2 });
  });
});



