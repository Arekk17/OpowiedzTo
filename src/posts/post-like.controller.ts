import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostLikeService } from './post-like.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

interface RequestWithUser extends Request {
  user: {
    id: string;
  };
}

@ApiTags('post-likes')
@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostLikeController {
  constructor(private readonly postLikeService: PostLikeService) {}

  @Post(':id/like')
  @ApiOperation({ summary: 'Polub post' })
  @ApiResponse({ status: 201, description: 'Post został polubiony' })
  @ApiResponse({ status: 400, description: 'Nieprawidłowe żądanie' })
  @ApiResponse({ status: 404, description: 'Post nie znaleziony' })
  async likePost(
    @Param('id') postId: string,
    @Request() req: RequestWithUser,
  ): Promise<{ message: string }> {
    await this.postLikeService.likePost(req.user.id, postId);
    return { message: 'Post został polubiony' };
  }

  @Delete(':id/unlike')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Usuń polubienie posta' })
  @ApiResponse({ status: 204, description: 'Polubienie zostało usunięte' })
  @ApiResponse({ status: 404, description: 'Polubienie nie istnieje' })
  async unlikePost(
    @Param('id') postId: string,
    @Request() req: RequestWithUser,
  ): Promise<void> {
    await this.postLikeService.unlikePost(req.user.id, postId);
  }

  @Get(':id/likes')
  @ApiOperation({ summary: 'Pobierz listę użytkowników, którzy polubili post' })
  @ApiResponse({ status: 200, description: 'Lista użytkowników', type: [User] })
  async getLikes(@Param('id') postId: string): Promise<User[]> {
    return this.postLikeService.getLikes(postId);
  }

  @Get(':id/likes/count')
  @ApiOperation({ summary: 'Pobierz liczbę polubień posta' })
  @ApiResponse({ status: 200, description: 'Liczba polubień' })
  async getLikeCount(@Param('id') postId: string): Promise<{ count: number }> {
    const count = await this.postLikeService.getLikeCount(postId);
    return { count };
  }
}
