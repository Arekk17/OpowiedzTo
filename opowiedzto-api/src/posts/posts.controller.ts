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
  ApiOkResponse,
  ApiExtraModels,
  getSchemaPath,
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
import { AuthorDto } from './dto/author.dto';
import { CommentWithAuthorDto } from './dto/comment-with-author.dto';
import { User } from '../users/entities/user.entity';
import { decodeCursor } from './dto/cursor.dto';

@ApiTags('posts')
@ApiExtraModels(AuthorDto, CommentWithAuthorDto, PostWithDetailsDto)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    summary: 'Pobierz wszystkie posty z opcjonalną filtracją i paginacją',
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(PostWithDetailsDto) },
        },
        nextCursor: { type: 'string', nullable: true },
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
  @ApiOperation({
    summary: 'Pobierz post po ID (tylko zalogowani użytkownicy)',
  })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: PostWithDetailsDto })
  @ApiResponse({ status: 404 })
  @ApiResponse({ status: 401 })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @GetOptionalUser() user?: User,
  ): Promise<PostWithDetailsDto> {
    return this.postsService.findOneWithDetails(id, user?.id);
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
