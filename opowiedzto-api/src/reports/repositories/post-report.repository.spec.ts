import { DataSource, EntityManager } from 'typeorm';

import { PostReportRepository } from './post-report.repository';

const createRepository = () => {
  const manager = {
    findOne: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
  } as unknown as EntityManager;

  const dataSource = {
    createEntityManager: () => manager,
  } as unknown as DataSource;

  const repository = new PostReportRepository(dataSource);
  return { repository, manager };
};

describe('PostReportRepository', () => {
  it('sprawdza czy użytkownik zgłosił post', async () => {
    const { repository, manager } = createRepository();
    (manager.findOne as jest.Mock).mockResolvedValue({ id: 'report' });

    await expect(repository.hasUserAlreadyReported('post', 'user')).resolves.toBe(true);
    expect(manager.findOne).toHaveBeenCalledWith({
      where: { postId: 'post', reporterId: 'user' },
    });
  });

  it('pobiera zgłoszenia posta', async () => {
    const { repository, manager } = createRepository();
    const reports = [{ id: 'report-1' }];
    (manager.find as jest.Mock).mockResolvedValue(reports);

    await expect(repository.getReportsForPost('post')).resolves.toBe(reports);
    expect(manager.find).toHaveBeenCalledWith({
      where: { postId: 'post' },
      relations: ['reporter'],
      order: { createdAt: 'DESC' },
    });
  });

  it('zwraca liczbę zgłoszeń', async () => {
    const { repository, manager } = createRepository();
    (manager.count as jest.Mock).mockResolvedValue(4);

    await expect(repository.getReportCount('post')).resolves.toBe(4);
    expect(manager.count).toHaveBeenCalledWith({ where: { postId: 'post' } });
  });
});



