import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { Tag } from './entities/tag.entity';
import { TagsListQueryDto } from './dto/tags-list.query.dto';
import { SuggestQueryDto } from './dto/suggest.query.dto';

@ApiTags('tags')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({ status: 200, description: 'Tags fetched successfully' })
  @ApiResponse({ status: 400, description: 'Nieprawidłowe parametry' })
  @ApiResponse({ status: 500, description: 'Błąd serwera' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'orderBy', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, type: String })
  async findAll(
    @Query() q: TagsListQueryDto,
  ): Promise<{ data: Tag[]; total: number }> {
    return this.tagsService.list(q.search, q.page, q.limit, q.orderBy, q.order);
  }

  @Get('suggest')
  @ApiOperation({ summary: 'Sugestie tagów (prefix ILIKE)' })
  @ApiQuery({ name: 'q', required: true, example: 'li' })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Sugestie', type: [Tag] })
  @ApiResponse({ status: 400, description: 'Nieprawidłowe parametry' })
  @ApiResponse({ status: 500, description: 'Błąd serwera' })
  async suggest(@Query() q: SuggestQueryDto): Promise<Tag[]> {
    return this.tagsService.suggest(q.q, q.limit);
  }
  @Get('trending')
  @ApiOperation({ summary: 'Najpopularniejsze tagi' })
  @ApiQuery({ name: 'limit', required: false, example: 6 })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          tag: { type: 'string', example: 'javascript' },
          count: { type: 'number', example: 123 },
        },
      },
    },
  })
  async trending(
    @Query('limit') limit?: number,
  ): Promise<{ tag: string; count: number }[]> {
    const safe = Math.min(Math.max(Number(limit) || 6, 1), 50);
    return this.tagsService.getTrendingTags(safe);
  }
}
