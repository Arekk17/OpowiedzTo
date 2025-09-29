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
    console.log('likePost', userId, postId);
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

    const savedLike = await this.postLikeRepository.save(like);

    // Aktualizuj licznik polubień
    await this.postRepository.increment({ id: postId }, 'likesCount', 1);

    return savedLike;
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

    // Aktualizuj licznik polubień
    await this.postRepository.decrement({ id: postId }, 'likesCount', 1);
  }

  async getLikes(postId: string): Promise<User[]> {
    const likes = await this.postLikeRepository.findLikesWithUsers(postId);
    return likes.map((like) => like.user);
  }

  async getLikeCount(postId: string): Promise<number> {
    return this.postLikeRepository.countLikes(postId);
  }
}
