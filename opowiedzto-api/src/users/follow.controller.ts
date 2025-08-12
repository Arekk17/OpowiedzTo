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
import { FollowService } from './follow.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';

interface RequestWithUser extends Request {
  user: {
    id: string;
  };
}

@ApiTags('follows')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post(':id/follow')
  @ApiOperation({ summary: 'Followuj użytkownika' })
  @ApiResponse({
    status: 201,
    description: 'Użytkownik został pomyślnie followowany',
  })
  @ApiResponse({ status: 400, description: 'Nieprawidłowe żądanie' })
  @ApiResponse({ status: 404, description: 'Użytkownik nie znaleziony' })
  async followUser(
    @Param('id') followingId: string,
    @Request() req: RequestWithUser,
  ): Promise<{ message: string }> {
    await this.followService.followUser(req.user.id, followingId);
    return { message: 'Użytkownik został pomyślnie followowany' };
  }

  @Delete(':id/unfollow')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Przestań followować użytkownika' })
  @ApiResponse({
    status: 204,
    description: 'Użytkownik został pomyślnie unfollowowany',
  })
  @ApiResponse({ status: 404, description: 'Relacja follow nie istnieje' })
  async unfollowUser(
    @Param('id') followingId: string,
    @Request() req: RequestWithUser,
  ): Promise<void> {
    await this.followService.unfollowUser(req.user.id, followingId);
  }

  @Get(':id/followers')
  @ApiOperation({ summary: 'Pobierz listę followersów użytkownika' })
  @ApiResponse({ status: 200, description: 'Lista followersów', type: [User] })
  async getFollowers(@Param('id') userId: string): Promise<User[]> {
    return this.followService.getFollowers(userId);
  }

  @Get(':id/following')
  @ApiOperation({
    summary: 'Pobierz listę użytkowników, których followuje dany użytkownik',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista followowanych użytkowników',
    type: [User],
  })
  async getFollowing(@Param('id') userId: string): Promise<User[]> {
    return this.followService.getFollowing(userId);
  }
}
