import { TagsService } from './tags.service';
import { TagRepository } from './repository/tag.repository';
import { Tag } from './entities/tag.entity';

describe('TagsService', () => {
  let service: TagsService;
  let repository: jest.Mocked<TagRepository>;
  const queryBuilder = {
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn(),
  };

  beforeEach(() => {
    repository = {
      findAllTags: jest.fn(),
      suggest: jest.fn(),
      findOneBySlug: jest.fn(),
      findBySlugs: jest.fn(),
      insert: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
      getTrendingTags: jest.fn(),
    } as unknown as jest.Mocked<TagRepository>;

    queryBuilder.update.mockReturnThis();
    queryBuilder.set.mockReturnThis();
    queryBuilder.where.mockReturnThis();
    queryBuilder.execute.mockResolvedValue(undefined);

    service = new TagsService(repository);
  });

  it('list deleguje do repozytorium', async () => {
    const result = { data: [] as Tag[], total: 0 };
    repository.findAllTags.mockResolvedValue(result);

    await expect(service.list('tag', 1, 10, 'count', 'DESC')).resolves.toBe(result);
    expect(repository.findAllTags).toHaveBeenCalledWith('tag', 1, 10, 'count', 'DESC');
  });

  it('suggest deleguje do repozytorium', async () => {
    const tags = [{ slug: 'tech' } as Tag];
    repository.suggest.mockResolvedValue(tags);

    await expect(service.suggest('te', 5)).resolves.toBe(tags);
  });

  it('findOneBySlug deleguje do repozytorium', async () => {
    const tag = { slug: 'tech' } as Tag;
    repository.findOneBySlug.mockResolvedValue(tag);

    await expect(service.findOneBySlug('tech')).resolves.toBe(tag);
  });

  it('findBySlugs deleguje do repozytorium', async () => {
    const tags = [{ slug: 'tech' } as Tag];
    repository.findBySlugs.mockResolvedValue(tags);

    await expect(service.findBySlugs(['tech'])).resolves.toBe(tags);
  });

  describe('upsertManyBySlugs', () => {
    it('wstawia brakujące tagi po oczyszczeniu', async () => {
      repository.findBySlugs.mockResolvedValue([{ slug: 'tech' } as Tag]);
      repository.insert.mockResolvedValue({} as never);

      await service.upsertManyBySlugs([' Tech ', 'design', 'TECH']);

      expect(repository.findBySlugs).toHaveBeenCalledWith(['tech', 'design']);
      expect(repository.insert).toHaveBeenCalledWith([{ name: 'design', slug: 'design' }]);
    });

    it('kończy się bez działań, gdy brak wartości', async () => {
      await service.upsertManyBySlugs([]);

      expect(repository.findBySlugs).not.toHaveBeenCalled();
      expect(repository.insert).not.toHaveBeenCalled();
    });
  });

  describe('incrementPostCount', () => {
    it('aktualizuje liczniki znormalizowanych tagów', async () => {
      await service.incrementPostCount([' Tech ', 'tech', 'Design'], 2);

      expect(repository.createQueryBuilder).toHaveBeenCalled();
      expect(queryBuilder.where).toHaveBeenCalledWith('slug IN (:...slugs)', {
        slugs: ['tech', 'design'],
      });
      expect(queryBuilder.set).toHaveBeenCalledWith({ postCount: expect.any(Function) });
      expect(queryBuilder.execute).toHaveBeenCalled();
    });

    it('nic nie robi, gdy brak slugs', async () => {
      await service.incrementPostCount([], 1);

      expect(repository.createQueryBuilder).not.toHaveBeenCalled();
    });
  });

  it('getTrendingTags deleguje do repozytorium', async () => {
    const trending = [{ tag: 'tech', count: 10 }];
    repository.getTrendingTags.mockResolvedValue(trending);

    await expect(service.getTrendingTags(3)).resolves.toBe(trending);
  });
});



