import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PostLikeService } from './post-like.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('post-likes')
@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostLikeController {
  constructor(private readonly postLikeService: PostLikeService) {}

  @Post(':id/like')
  @ApiOperation({ summary: 'Polub post' })
  @ApiParam({ name: 'id', description: 'ID posta' })
  @ApiResponse({ status: 201, description: 'Post został polubiony' })
  @ApiResponse({ status: 400, description: 'Nieprawidłowe żądanie' })
  @ApiResponse({ status: 404, description: 'Post nie znaleziony' })
  async likePost(
    @Param('id', ParseUUIDPipe) postId: string,
    @GetUser() user: User,
  ): Promise<{ message: string }> {
    await this.postLikeService.likePost(user.id, postId);
    return { message: 'Post został polubiony' };
  }

  @Delete(':id/unlike')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Usuń polubienie posta' })
  @ApiParam({ name: 'id', description: 'ID posta' })
  @ApiResponse({ status: 204, description: 'Polubienie zostało usunięte' })
  @ApiResponse({ status: 404, description: 'Polubienie nie istnieje' })
  async unlikePost(
    @Param('id', ParseUUIDPipe) postId: string,
    @GetUser() user: User,
  ): Promise<void> {
    await this.postLikeService.unlikePost(user.id, postId);
  }

  @Get(':id/likes')
  @ApiOperation({ summary: 'Pobierz listę użytkowników, którzy polubili post' })
  @ApiParam({ name: 'id', description: 'ID posta' })
  @ApiResponse({ status: 200, description: 'Lista użytkowników', type: [User] })
  async getLikes(@Param('id', ParseUUIDPipe) postId: string): Promise<User[]> {
    return this.postLikeService.getLikes(postId);
  }

  @Get(':id/likes/count')
  @ApiOperation({ summary: 'Pobierz liczbę polubień posta' })
  @ApiParam({ name: 'id', description: 'ID posta' })
  @ApiResponse({ status: 200, description: 'Liczba polubień' })
  async getLikeCount(
    @Param('id', ParseUUIDPipe) postId: string,
  ): Promise<{ count: number }> {
    const count = await this.postLikeService.getLikeCount(postId);
    return { count };
  }
}
