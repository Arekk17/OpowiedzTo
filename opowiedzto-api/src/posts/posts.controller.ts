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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    summary: 'Pobierz wszystkie posty z opcjonalną filtracją i paginacją',
    description:
      'Zwraca listę postów z efektywną paginacją na poziomie bazy danych. Obsługuje filtrowanie po tagu i autorze.',
  })
  @ApiResponse({
    status: 200,
    description: 'Zwraca listę postów z metadanymi paginacji',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Post' },
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
  @Get()
  findAll(
    @Query() filters: PostFiltersDto,
  ): Promise<{ data: PostEntity[]; meta: any }> {
    return this.postsService.findAll(
      filters.tag,
      filters.authorId,
      filters.page,
      filters.limit,
    );
  }

  @ApiOperation({ summary: 'Pobierz wszystkie posty danego autora' })
  @ApiParam({ name: 'authorId', description: 'ID autora' })
  @ApiResponse({
    status: 200,
    description: 'Zwraca listę postów',
    type: [PostEntity],
  })
  @Get('author/:authorId')
  findByAuthor(
    @Param('authorId', ParseUUIDPipe) authorId: string,
  ): Promise<PostEntity[]> {
    return this.postsService.findByAuthor(authorId);
  }

  @ApiOperation({ summary: 'Wyszukaj posty z paginacją' })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Termin wyszukiwania',
    example: 'życie',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Numer strony (domyślnie 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Liczba postów na stronę (domyślnie 10, maksymalnie 100)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Zwraca wyniki wyszukiwania z metadanymi paginacji',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Post' },
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
  @Get('search')
  search(
    @Query() searchDto: SearchDto,
  ): Promise<{ data: PostEntity[]; meta: any }> {
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
    );
  }

  @ApiOperation({
    summary: 'Pobierz post po ID (tylko zalogowani użytkownicy)',
  })
  @ApiParam({ name: 'id', description: 'ID posta' })
  @ApiResponse({ status: 200, description: 'Zwraca post', type: PostEntity })
  @ApiResponse({ status: 404, description: 'Post nie został znaleziony' })
  @ApiResponse({ status: 401, description: 'Brak autoryzacji' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PostEntity> {
    return this.postsService.findOne(id);
  }

  @ApiOperation({ summary: 'Dodaj nowy post (tylko zalogowani użytkownicy)' })
  @ApiResponse({
    status: 201,
    description: 'Post został utworzony',
    type: PostEntity,
  })
  @ApiResponse({
    status: 401,
    description: 'Brak autoryzacji',
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
  @ApiParam({ name: 'id', description: 'ID posta' })
  @ApiResponse({
    status: 200,
    description: 'Post został zaktualizowany',
    type: PostEntity,
  })
  @ApiResponse({ status: 403, description: 'Brak uprawnień do edycji' })
  @ApiResponse({ status: 404, description: 'Post nie został znaleziony' })
  @ApiResponse({ status: 401, description: 'Brak autoryzacji' })
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
  @ApiParam({ name: 'id', description: 'ID posta' })
  @ApiResponse({ status: 204, description: 'Post został usunięty' })
  @ApiResponse({ status: 403, description: 'Brak uprawnień do usunięcia' })
  @ApiResponse({ status: 404, description: 'Post nie został znaleziony' })
  @ApiResponse({ status: 401, description: 'Brak autoryzacji' })
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
