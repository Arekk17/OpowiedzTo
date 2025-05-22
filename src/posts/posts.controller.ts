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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DeletePostDto } from './dto/delete-post.dto';
import { Post as PostEntity } from './entities/post.entity';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Pobierz wszystkie posty z opcjonalną filtracją' })
  @ApiQuery({
    name: 'tag',
    required: false,
    description: 'Filtrowanie po tagu',
  })
  @ApiQuery({
    name: 'authorId',
    required: false,
    description: 'Filtrowanie po autorze',
  })
  @ApiResponse({
    status: 200,
    description: 'Zwraca listę postów',
    type: [PostEntity],
  })
  @Get()
  findAll(
    @Query('tag') tag?: string,
    @Query('authorId') authorId?: string,
  ): Promise<PostEntity[]> {
    return this.postsService.findAll(tag, authorId);
  }

  @ApiOperation({ summary: 'Pobierz post po ID' })
  @ApiParam({ name: 'id', description: 'ID posta' })
  @ApiResponse({ status: 200, description: 'Zwraca post', type: PostEntity })
  @ApiResponse({ status: 404, description: 'Post nie został znaleziony' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<PostEntity> {
    return this.postsService.findOne(id);
  }

  @ApiOperation({ summary: 'Pobierz wszystkie posty danego autora' })
  @ApiParam({ name: 'authorId', description: 'ID autora' })
  @ApiResponse({
    status: 200,
    description: 'Zwraca listę postów',
    type: [PostEntity],
  })
  @Get('author/:authorId')
  findByAuthor(@Param('authorId') authorId: string): Promise<PostEntity[]> {
    return this.postsService.findByAuthor(authorId);
  }

  @ApiOperation({ summary: 'Dodaj nowy post' })
  @ApiResponse({
    status: 201,
    description: 'Post został utworzony',
    type: PostEntity,
  })
  @Post()
  create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postsService.create(createPostDto);
  }

  @ApiOperation({ summary: 'Edytuj post' })
  @ApiParam({ name: 'id', description: 'ID posta' })
  @ApiResponse({
    status: 200,
    description: 'Post został zaktualizowany',
    type: PostEntity,
  })
  @ApiResponse({ status: 403, description: 'Brak uprawnień do edycji' })
  @ApiResponse({ status: 404, description: 'Post nie został znaleziony' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    return this.postsService.update(id, updatePostDto);
  }

  @ApiOperation({ summary: 'Usuń post' })
  @ApiParam({ name: 'id', description: 'ID posta' })
  @ApiResponse({ status: 204, description: 'Post został usunięty' })
  @ApiResponse({ status: 403, description: 'Brak uprawnień do usunięcia' })
  @ApiResponse({ status: 404, description: 'Post nie został znaleziony' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Body() deletePostDto: DeletePostDto,
  ): Promise<void> {
    return this.postsService.remove(id, deletePostDto.authorId);
  }
}
