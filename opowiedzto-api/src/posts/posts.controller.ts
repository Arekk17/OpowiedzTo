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
import { PostFiltersDto, SearchDto } from './dto/pagination.dto';
import { Post as PostEntity } from './entities/post.entity';
import { PostWithDetailsDto } from './dto/post-with-details.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { GetOptionalUser } from '../auth/decorators/get-optional-user.decorator';
import { User } from '../users/entities/user.entity';
import { TrendingTagDto } from './dto/trending-tag.dto';

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
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findAll(
    @Query() filters: PostFiltersDto,
    @GetOptionalUser() user?: User,
  ): Promise<{ data: PostWithDetailsDto[]; meta: any }> {
    console.log(
      `PostsController.findAll: user=${user?.id || 'null'}, filters=`,
      filters,
    );
    return this.postsService.findAll(
      filters.tag,
      filters.authorId,
      filters.page,
      filters.limit,
      user?.id,
      filters.sortBy,
    );
  }
  @ApiOperation({ summary: 'Najpopularniejsze tagi' })
  @ApiQuery({ name: 'limit', required: false, example: 6 })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'array',
      items: { $ref: '#/components/schemas/TrendingTagDto' },
    },
  })
  @Get('trending')
  trending(@Query('limit') limit?: number): Promise<TrendingTagDto[]> {
    const safeLimit = Math.min(
      Math.max(parseInt(String(limit || 6), 10) || 6, 1),
      50,
    );
    return this.postsService.getTrendingTags(safeLimit);
  }

  @ApiOperation({ summary: 'Wyszukaj posty z paginacją' })
  @ApiQuery({
    name: 'q',
    required: true,
    example: 'życie',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
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
            total: { type: 'number', example: 25 },
            totalPages: { type: 'number', example: 3 },
            hasNextPage: { type: 'boolean', example: true },
            hasPreviousPage: { type: 'boolean', example: false },
            searchTerm: { type: 'string', example: 'życie' },
          },
        },
      },
    },
  })
  @UseGuards(OptionalJwtAuthGuard)
  @Get('search')
  search(
    @Query() searchDto: SearchDto,
    @GetOptionalUser() user?: User,
  ): Promise<{ data: PostWithDetailsDto[]; meta: any }> {
    if (!searchDto.q || searchDto.q.trim() === '') {
      return Promise.resolve({
        data: [],
        meta: {
          page: searchDto.page || 1,
          limit: searchDto.limit || 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
          searchTerm: '',
        },
      });
    }
    return this.postsService.search(
      searchDto.q.trim(),
      searchDto.page,
      searchDto.limit,
      user?.id,
    );
  }

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
