import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PostLike } from '../entities/post-like.entity';

@Injectable()
export class PostLikeRepository extends Repository<PostLike> {
  constructor(private dataSource: DataSource) {
    super(PostLike, dataSource.createEntityManager());
  }

  async findByUserAndPost(
    userId: string,
    postId: string,
  ): Promise<PostLike | null> {
    return this.findOne({
      where: { userId, postId },
    });
  }

  async findLikesWithUsers(postId: string): Promise<PostLike[]> {
    return this.find({
      where: { postId },
      relations: ['user'],
    });
  }

  async countLikes(postId: string): Promise<number> {
    return this.count({
      where: { postId },
    });
  }
}
