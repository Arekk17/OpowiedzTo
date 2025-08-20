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
import { FollowService } from './follow.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';

@ApiTags('follows')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post(':id/follow')
  @ApiOperation({ summary: 'Followuj użytkownika' })
  @ApiParam({ name: 'id', description: 'ID użytkownika do followowania' })
  @ApiResponse({
    status: 201,
    description: 'Użytkownik został pomyślnie followowany',
  })
  @ApiResponse({ status: 400, description: 'Nieprawidłowe żądanie' })
  @ApiResponse({ status: 404, description: 'Użytkownik nie znaleziony' })
  async followUser(
    @Param('id', ParseUUIDPipe) followingId: string,
    @GetUser() user: User,
  ): Promise<{ message: string }> {
    await this.followService.followUser(user.id, followingId);
    return { message: 'Użytkownik został pomyślnie followowany' };
  }

  @Delete(':id/unfollow')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Przestań followować użytkownika' })
  @ApiParam({ name: 'id', description: 'ID użytkownika do unfollowowania' })
  @ApiResponse({
    status: 204,
    description: 'Użytkownik został pomyślnie unfollowowany',
  })
  @ApiResponse({ status: 404, description: 'Relacja follow nie istnieje' })
  async unfollowUser(
    @Param('id', ParseUUIDPipe) followingId: string,
    @GetUser() user: User,
  ): Promise<void> {
    await this.followService.unfollowUser(user.id, followingId);
  }

  @Get(':id/followers')
  @ApiOperation({ summary: 'Pobierz listę followersów użytkownika' })
  @ApiParam({ name: 'id', description: 'ID użytkownika' })
  @ApiResponse({ status: 200, description: 'Lista followersów', type: [User] })
  async getFollowers(
    @Param('id', ParseUUIDPipe) userId: string,
  ): Promise<User[]> {
    return this.followService.getFollowers(userId);
  }

  @Get(':id/following')
  @ApiOperation({
    summary: 'Pobierz listę użytkowników, których followuje dany użytkownik',
  })
  @ApiParam({ name: 'id', description: 'ID użytkownika' })
  @ApiResponse({
    status: 200,
    description: 'Lista followowanych użytkowników',
    type: [User],
  })
  async getFollowing(
    @Param('id', ParseUUIDPipe) userId: string,
  ): Promise<User[]> {
    return this.followService.getFollowing(userId);
  }
}
