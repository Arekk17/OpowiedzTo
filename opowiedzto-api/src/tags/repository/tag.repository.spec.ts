import { DataSource, EntityManager } from 'typeorm';

import { TagRepository } from './tag.repository';
import { Tag } from '../entities/tag.entity';

const createRepository = () => {
  const queryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue(undefined),
    getMany: jest.fn(),
    getCount: jest.fn(),
    getRawMany: jest.fn(),
    getOne: jest.fn(),
  };

  const manager = {
    find: jest.fn(),
    findOne: jest.fn(),
    insert: jest.fn(),
    createQueryBuilder: jest.fn(() => queryBuilder),
  } as unknown as EntityManager;

  const dataSource = {
    createEntityManager: () => manager,
  } as unknown as DataSource;

  const repository = new TagRepository(dataSource);
  return { repository, manager, queryBuilder };
};

describe('TagRepository', () => {
  it('zwraca pustą listę, gdy brak slugów', async () => {
    const { repository, manager } = createRepository();

    await expect(repository.findBySlugs([])).resolves.toEqual([]);
    expect(manager.find).not.toHaveBeenCalled();
  });

  it('pobiera tagi po slugach', async () => {
    const { repository, manager } = createRepository();
    (manager.find as jest.Mock).mockResolvedValue([{ slug: 'js' }]);

    await expect(repository.findBySlugs(['js'])).resolves.toEqual([{ slug: 'js' }]);
    expect(manager.find).toHaveBeenCalledTimes(1);
  });

  it('suggest przycina limit i zwraca wyniki', async () => {
    const { repository, queryBuilder } = createRepository();
    queryBuilder.getMany.mockResolvedValue([{ slug: 'js' } as Tag]);

    await expect(repository.suggest('j', 100)).resolves.toEqual([{ slug: 'js' }]);
    expect(queryBuilder.limit).toHaveBeenCalledWith(50);
  });

  it('findAllTags stosuje wyszukiwanie po frazie', async () => {
    const { repository, queryBuilder } = createRepository();
    queryBuilder.getCount.mockResolvedValue(10);
    queryBuilder.getMany.mockResolvedValue([{ slug: 'js' }]);

    await expect(repository.findAllTags('js', 2, 5, 'tag', 'DESC')).resolves.toEqual({
      data: [{ slug: 'js' }],
      total: 10,
    });
    expect(queryBuilder.where).toHaveBeenCalled();
    expect(queryBuilder.skip).toHaveBeenCalledWith(5);
    expect(queryBuilder.take).toHaveBeenCalledWith(5);
  });

  it('findOneBySlug zwraca null dla pustego wejścia', async () => {
    const { repository, manager } = createRepository();
    (manager.findOne as jest.Mock).mockResolvedValue(null);

    await expect(repository.findOneBySlug('   ')).resolves.toBeNull();
    expect(manager.findOne).not.toHaveBeenCalled();
  });

  it('findOneBySlug wyszukuje po slug i nazwie', async () => {
    const { repository, manager, queryBuilder } = createRepository();
    (manager.findOne as jest.Mock).mockResolvedValueOnce(null);
    queryBuilder.getOne.mockResolvedValue({ slug: 'tag' } as Tag);

    await expect(repository.findOneBySlug('Tag')).resolves.toEqual({ slug: 'tag' });
    expect(manager.findOne).toHaveBeenCalledWith({ where: { slug: 'tag' } });
    expect(queryBuilder.where).toHaveBeenCalled();
  });

  it('getTrendingTags zwraca mapowane wartości liczbowe', async () => {
    const { repository, queryBuilder } = createRepository();
    queryBuilder.getRawMany.mockResolvedValue([{ tag: 'js', count: '5' }]);

    await expect(repository.getTrendingTags(10)).resolves.toEqual([
      { tag: 'js', count: 5 },
    ]);
    expect(queryBuilder.select).toHaveBeenCalled();
    expect(queryBuilder.limit).toHaveBeenCalledWith(10);
  });
});



