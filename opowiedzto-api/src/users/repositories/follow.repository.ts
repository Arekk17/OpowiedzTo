import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Follow } from '../entities/follow.entity';

@Injectable()
export class FollowRepository extends Repository<Follow> {
  constructor(private dataSource: DataSource) {
    super(Follow, dataSource.createEntityManager());
  }

  async findByFollowerAndFollowing(
    followerId: string,
    followingId: string,
  ): Promise<Follow | null> {
    return this.findOne({
      where: { followerId, followingId },
    });
  }

  async findFollowersWithDetails(userId: string): Promise<Follow[]> {
    return this.find({
      where: { followingId: userId },
      relations: ['follower'],
    });
  }

  async findFollowingWithDetails(userId: string): Promise<Follow[]> {
    return this.find({
      where: { followerId: userId },
      relations: ['following'],
    });
  }

  async countFollowers(userId: string): Promise<number> {
    return this.count({
      where: { followingId: userId },
    });
  }

  async countFollowing(userId: string): Promise<number> {
    return this.count({
      where: { followerId: userId },
    });
  }
}
