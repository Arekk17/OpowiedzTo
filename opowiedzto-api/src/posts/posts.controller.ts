import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostFiltersDto } from './dto/pagination.dto';
import { Post as PostEntity } from './entities/post.entity';
import { PostWithDetailsDto } from './dto/post-with-details.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { GetOptionalUser } from '../auth/decorators/get-optional-user.decorator';
import { User } from '../users/entities/user.entity';
import { decodeCursor } from './dto/cursor.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    summary: 'Pobierz wszystkie posty z opcjonalną filtracją i paginacją',
  })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/PostWithDetailsDto' },
        },
        meta: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            total: { type: 'number', example: 100 },
            totalPages: { type: 'number', example: 10 },
          },
        },
      },
    },
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Kursor do paginacji (opcjonalny)',
    example:
      'eyJjcmVhdGVkQXQiOiIyMDI0LTAxLTAxVDEyOjAwOjAwLjAwMFoiLCJpZCI6IjEyMyIsImxpa2VzQ291bnQiOjAsImNvbW1lbnRzQ291bnQiOjB9',
  })
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findAll(
    @Query() filters: PostFiltersDto,
    @Query('cursor') cursor?: string,
    @GetOptionalUser() user?: User,
  ): Promise<{ data: PostWithDetailsDto[]; nextCursor: string | null }> {
    const decoded = decodeCursor(cursor);
    return this.postsService.findAllCursor(
      filters.tag,
      filters.authorId,
      filters.limit,
      user?.id,
      filters.sortBy,
      decoded,
    );
  }
  @ApiOperation({ summary: 'Pojedynczy post' })
  @ApiQuery({ name: 'limit', required: false, example: 6 })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'array',
      items: { $ref: '#/components/schemas/TrendingTagDto' },
    },
  })
  @ApiOperation({
    summary: 'Pobierz post po ID (tylko zalogowani użytkownicy)',
  })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: PostEntity })
  @ApiResponse({ status: 404 })
  @ApiResponse({ status: 401 })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PostEntity> {
    return this.postsService.findOne(id);
  }

  @ApiOperation({ summary: 'Dodaj nowy post (tylko zalogowani użytkownicy)' })
  @ApiResponse({
    status: 201,
    type: PostEntity,
  })
  @ApiResponse({
    status: 401,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: User,
  ): Promise<PostEntity> {
    return this.postsService.create(createPostDto, user);
  }

  @ApiOperation({ summary: 'Edytuj post (tylko zalogowani użytkownicy)' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: 200,
    type: PostEntity,
  })
  @ApiResponse({ status: 403 })
  @ApiResponse({ status: 404 })
  @ApiResponse({ status: 401 })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
    @GetUser() user: User,
  ): Promise<PostEntity> {
    return this.postsService.update(id, updatePostDto, user);
  }

  @ApiOperation({ summary: 'Usuń post (tylko zalogowani użytkownicy)' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 403 })
  @ApiResponse({ status: 404 })
  @ApiResponse({ status: 401 })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.postsService.remove(id, user.id);
  }
}
