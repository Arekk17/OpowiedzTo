import { Injectable } from '@nestjs/common';
import { PostLike } from './entities/post-like.entity';
import { User } from '../users/entities/user.entity';
import { PostsService } from './posts.service';

@Injectable()
export class PostLikeService {
  constructor(private readonly postsService: PostsService) {}

  async likePost(userId: string, postId: string): Promise<PostLike> {
    return this.postsService.likePost(userId, postId);
  }

  async unlikePost(userId: string, postId: string): Promise<void> {
    return this.postsService.unlikePost(userId, postId);
  }

  async getLikes(postId: string): Promise<User[]> {
    return this.postsService.getLikes(postId);
  }

  async getLikeCount(postId: string): Promise<number> {
    return this.postsService.getLikeCount(postId);
  }
}
