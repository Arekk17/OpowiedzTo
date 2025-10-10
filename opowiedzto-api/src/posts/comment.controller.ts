import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CommentRepository } from './repositories/comment.repository';
import { PostsRepository } from './repositories/posts.repository';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { BANNED_WORDS } from '../common/constants/banned-words';

@ApiTags('comments')
@Controller()
export class CommentController {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  @Post('posts/:id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Dodaj komentarz do posta' })
  @ApiParam({ name: 'id', description: 'ID posta' })
  @ApiResponse({
    status: 201,
    description: 'Komentarz został dodany',
    type: Comment,
  })
  @ApiResponse({ status: 400, description: 'Nieprawidłowe żądanie' })
  @ApiResponse({ status: 404, description: 'Post nie znaleziony' })
  async createComment(
    @Param('id', ParseUUIDPipe) postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: User,
  ): Promise<Comment> {
    // Sprawdź czy post istnieje
    const post = await this.postsRepository.findEntityById(postId);
    if (!post) {
      throw new NotFoundException('Post nie istnieje');
    }

    // Sprawdź banned words
    const contentLower = createCommentDto.content.toLowerCase();
    const containsBanned = BANNED_WORDS.some((word) =>
      contentLower.includes(word),
    );
    if (containsBanned) {
      throw new BadRequestException('Komentarz zawiera niedozwolone słowa');
    }

    return this.commentRepository.save({
      postId,
      authorId: user.id,
      content: createCommentDto.content,
    });
  }

  @Get('posts/:id/comments')
  @ApiOperation({ summary: 'Pobierz komentarze do posta' })
  @ApiParam({ name: 'id', description: 'ID posta' })
  @ApiResponse({
    status: 200,
    description: 'Lista komentarzy',
    type: [Comment],
  })
  async getComments(
    @Param('id', ParseUUIDPipe) postId: string,
  ): Promise<Comment[]> {
    return this.commentRepository.findByPost(postId);
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Usuń komentarz' })
  @ApiParam({ name: 'id', description: 'ID komentarza' })
  @ApiResponse({ status: 200, description: 'Komentarz został usunięty' })
  @ApiResponse({ status: 403, description: 'Brak uprawnień' })
  @ApiResponse({ status: 404, description: 'Komentarz nie znaleziony' })
  async deleteComment(
    @Param('id', ParseUUIDPipe) commentId: string,
    @GetUser() user: User,
  ): Promise<{ message: string }> {
    const comment = await this.commentRepository.findWithAuthor(commentId);
    if (!comment) {
      throw new NotFoundException('Komentarz nie istnieje');
    }
    if (comment.authorId !== user.id) {
      throw new ForbiddenException('Nie możesz usunąć tego komentarza');
    }
    await this.commentRepository.delete(commentId);
    return { message: 'Komentarz został usunięty' };
  }

  @Get('posts/:id/comments/count')
  @ApiOperation({ summary: 'Pobierz liczbę komentarzy do posta' })
  @ApiParam({ name: 'id', description: 'ID posta' })
  @ApiResponse({ status: 200, description: 'Liczba komentarzy' })
  async getCommentCount(
    @Param('id', ParseUUIDPipe) postId: string,
  ): Promise<{ count: number }> {
    const count = await this.commentRepository.countComments(postId);
    return { count };
  }
}
