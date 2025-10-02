import { Injectable } from '@nestjs/common';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PostsService } from './posts.service';

@Injectable()
export class CommentService {
  constructor(private readonly postsService: PostsService) {}

  async createComment(
    postId: string,
    authorId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return this.postsService.createComment(postId, authorId, createCommentDto);
  }

  async getComments(postId: string): Promise<Comment[]> {
    return this.postsService.getComments(postId);
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    return this.postsService.deleteComment(commentId, userId);
  }

  async getCommentCount(postId: string): Promise<number> {
    return this.postsService.getCommentCount(postId);
  }
}
