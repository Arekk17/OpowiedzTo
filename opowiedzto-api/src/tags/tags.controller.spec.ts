import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { Tag } from './entities/tag.entity';

describe('TagsController', () => {
  let controller: TagsController;
  let service: jest.Mocked<TagsService>;

  beforeEach(() => {
    service = {
      list: jest.fn(),
      suggest: jest.fn(),
      findOneBySlug: jest.fn(),
      findBySlugs: jest.fn(),
      upsertManyBySlugs: jest.fn(),
      incrementPostCount: jest.fn(),
      getTrendingTags: jest.fn(),
    } as unknown as jest.Mocked<TagsService>;

    controller = new TagsController(service);
  });

  it('findAll deleguje do serwisu z parametrami', async () => {
    const result = { data: [] as Tag[], total: 0 };
    service.list.mockResolvedValue(result);

    await expect(
      controller.findAll({ search: 'js', page: 2, limit: 20, orderBy: 'count', order: 'DESC' }),
    ).resolves.toBe(result);
    expect(service.list).toHaveBeenCalledWith('js', 2, 20, 'count', 'DESC');
  });

  it('suggest deleguje do serwisu', async () => {
    const tags = [{ slug: 'js' } as Tag];
    service.suggest.mockResolvedValue(tags);

    await expect(controller.suggest({ q: 'j', limit: 5 })).resolves.toBe(tags);
    expect(service.suggest).toHaveBeenCalledWith('j', 5);
  });

  it('trending ogranicza limit do zakresu 1-50', async () => {
    const trending = [{ tag: 'js', count: 10 }];
    service.getTrendingTags.mockResolvedValue(trending);

    await expect(controller.trending(500 as never)).resolves.toBe(trending);
    expect(service.getTrendingTags).toHaveBeenCalledWith(50);
  });
});



