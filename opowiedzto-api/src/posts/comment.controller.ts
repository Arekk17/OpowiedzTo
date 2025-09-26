import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@ApiTags('comments')
@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

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
    return this.commentService.createComment(postId, user.id, createCommentDto);
  }

  @Get('posts/:id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
    return this.commentService.getComments(postId);
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
    await this.commentService.deleteComment(commentId, user.id);
    return { message: 'Komentarz został usunięty' };
  }

  @Get('posts/:id/comments/count')
  @ApiOperation({ summary: 'Pobierz liczbę komentarzy do posta' })
  @ApiParam({ name: 'id', description: 'ID posta' })
  @ApiResponse({ status: 200, description: 'Liczba komentarzy' })
  async getCommentCount(
    @Param('id', ParseUUIDPipe) postId: string,
  ): Promise<{ count: number }> {
    const count = await this.commentService.getCommentCount(postId);
    return { count };
  }
}
