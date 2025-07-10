import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CommentRepository } from './repositories/comment.repository';
import { PostRepository } from './repositories/post.repository';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { BANNED_WORDS } from '../common/constants/banned-words';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async createComment(
    postId: string,
    authorId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post nie istnieje');
    }

    const contentLower = createCommentDto.content.toLowerCase();
    const containsBanned = BANNED_WORDS.some((word) =>
      contentLower.includes(word),
    );
    if (containsBanned) {
      throw new BadRequestException('Komentarz zawiera niedozwolone słowa');
    }

    const comment = this.commentRepository.create({
      postId,
      authorId,
      content: createCommentDto.content,
    });

    return this.commentRepository.save(comment);
  }

  async getComments(postId: string): Promise<Comment[]> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post nie istnieje');
    }

    return this.commentRepository.findByPost(postId);
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await this.commentRepository.findWithAuthor(commentId);
    if (!comment) {
      throw new NotFoundException('Komentarz nie istnieje');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException(
        'Nie masz uprawnień do usunięcia tego komentarza',
      );
    }

    await this.commentRepository.remove(comment);
  }

  async getCommentCount(postId: string): Promise<number> {
    return this.commentRepository.countComments(postId);
  }
}
