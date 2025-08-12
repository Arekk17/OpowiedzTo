import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PostLikeRepository } from './repositories/post-like.repository';
import { PostRepository } from './repositories/post.repository';
import { PostLike } from './entities/post-like.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostLikeService {
  constructor(
    private readonly postLikeRepository: PostLikeRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async likePost(userId: string, postId: string): Promise<PostLike> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post nie istnieje');
    }

    const existingLike = await this.postLikeRepository.findByUserAndPost(
      userId,
      postId,
    );

    if (existingLike) {
      throw new BadRequestException('Już polubiłeś ten post');
    }

    const like = this.postLikeRepository.create({
      userId,
      postId,
    });

    return this.postLikeRepository.save(like);
  }

  async unlikePost(userId: string, postId: string): Promise<void> {
    const like = await this.postLikeRepository.findByUserAndPost(
      userId,
      postId,
    );

    if (!like) {
      throw new NotFoundException('Nie polubiłeś tego posta');
    }

    await this.postLikeRepository.remove(like);
  }

  async getLikes(postId: string): Promise<User[]> {
    const likes = await this.postLikeRepository.findLikesWithUsers(postId);
    return likes.map((like) => like.user);
  }

  async getLikeCount(postId: string): Promise<number> {
    return this.postLikeRepository.countLikes(postId);
  }
}
