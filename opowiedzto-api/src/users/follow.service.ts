import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Follow } from './entities/follow.entity';
import { User } from './entities/user.entity';
import { FollowRepository } from './repositories/follow.repository';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class FollowService {
  constructor(
    private readonly followRepository: FollowRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async followUser(followerId: string, followingId: string): Promise<Follow> {
    if (followerId === followingId) {
      throw new BadRequestException('Nie możesz followować samego siebie');
    }

    const following = await this.userRepository.findOne({
      where: { id: followingId },
    });
    if (!following) {
      throw new NotFoundException('Użytkownik nie istnieje');
    }

    const existingFollow =
      await this.followRepository.findByFollowerAndFollowing(
        followerId,
        followingId,
      );

    if (existingFollow) {
      throw new BadRequestException('Już followujesz tego użytkownika');
    }

    const follow = this.followRepository.create({
      followerId,
      followingId,
    });

    return this.followRepository.save(follow);
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    const follow = await this.followRepository.findByFollowerAndFollowing(
      followerId,
      followingId,
    );

    if (!follow) {
      throw new NotFoundException('Relacja follow nie istnieje');
    }

    await this.followRepository.remove(follow);
  }

  async getFollowers(userId: string): Promise<User[]> {
    const follows =
      await this.followRepository.findFollowersWithDetails(userId);
    return follows.map((follow) => follow.follower);
  }

  async getFollowing(userId: string): Promise<User[]> {
    const follows =
      await this.followRepository.findFollowingWithDetails(userId);
    return follows.map((follow) => follow.following);
  }

  async getFollowersCount(userId: string): Promise<number> {
    return this.followRepository.countFollowers(userId);
  }

  async getFollowingCount(userId: string): Promise<number> {
    return this.followRepository.countFollowing(userId);
  }
}
