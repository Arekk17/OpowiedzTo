import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { User } from './entities/user.entity';

describe('FollowController', () => {
  let controller: FollowController;
  let service: jest.Mocked<FollowService>;

  beforeEach(() => {
    service = {
      followUser: jest.fn(),
      unfollowUser: jest.fn(),
      getFollowers: jest.fn(),
      getFollowing: jest.fn(),
      getFollowersCount: jest.fn(),
      getFollowingCount: jest.fn(),
    } as unknown as jest.Mocked<FollowService>;

    controller = new FollowController(service);
  });

  it('followUser zwraca komunikat po wywołaniu serwisu', async () => {
    const user = { id: 'user-1' } as User;

    const result = await controller.followUser('user-2', user);

    expect(service.followUser).toHaveBeenCalledWith('user-1', 'user-2');
    expect(result).toEqual({ message: 'Użytkownik został pomyślnie followowany' });
  });

  it('unfollowUser deleguje do serwisu', async () => {
    const user = { id: 'user-1' } as User;

    await controller.unfollowUser('user-2', user);

    expect(service.unfollowUser).toHaveBeenCalledWith('user-1', 'user-2');
  });

  it('getFollowers deleguje do serwisu', async () => {
    const followers = [{ id: 'user-2' } as User];
    service.getFollowers.mockResolvedValue(followers);

    await expect(controller.getFollowers('user-1')).resolves.toBe(followers);
  });

  it('getFollowing deleguje do serwisu', async () => {
    const following = [{ id: 'user-3' } as User];
    service.getFollowing.mockResolvedValue(following);

    await expect(controller.getFollowing('user-1')).resolves.toBe(following);
  });
});



