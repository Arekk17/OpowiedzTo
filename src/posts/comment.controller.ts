import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

interface RequestWithUser extends Request {
  user: {
    id: string;
  };
}

@ApiTags('comments')
@Controller()
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('posts/:id/comments')
  @ApiOperation({ summary: 'Dodaj komentarz do posta' })
  @ApiResponse({
    status: 201,
    description: 'Komentarz został dodany',
    type: Comment,
  })
  @ApiResponse({ status: 400, description: 'Nieprawidłowe żądanie' })
  @ApiResponse({ status: 404, description: 'Post nie znaleziony' })
  async createComment(
    @Param('id') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: RequestWithUser,
  ): Promise<Comment> {
    return this.commentService.createComment(
      postId,
      req.user.id,
      createCommentDto,
    );
  }

  @Get('posts/:id/comments')
  @ApiOperation({ summary: 'Pobierz komentarze do posta' })
  @ApiResponse({
    status: 200,
    description: 'Lista komentarzy',
    type: [Comment],
  })
  async getComments(@Param('id') postId: string): Promise<Comment[]> {
    return this.commentService.getComments(postId);
  }

  @Delete('comments/:id')
  @ApiOperation({ summary: 'Usuń komentarz' })
  @ApiResponse({ status: 200, description: 'Komentarz został usunięty' })
  @ApiResponse({ status: 403, description: 'Brak uprawnień' })
  @ApiResponse({ status: 404, description: 'Komentarz nie znaleziony' })
  async deleteComment(
    @Param('id') commentId: string,
    @Request() req: RequestWithUser,
  ): Promise<{ message: string }> {
    await this.commentService.deleteComment(commentId, req.user.id);
    return { message: 'Komentarz został usunięty' };
  }

  @Get('posts/:id/comments/count')
  @ApiOperation({ summary: 'Pobierz liczbę komentarzy do posta' })
  @ApiResponse({ status: 200, description: 'Liczba komentarzy' })
  async getCommentCount(
    @Param('id') postId: string,
  ): Promise<{ count: number }> {
    const count = await this.commentService.getCommentCount(postId);
    return { count };
  }
}
