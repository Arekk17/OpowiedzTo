import { DataSource, EntityManager } from 'typeorm';

import { CommentReportRepository } from './comment-report.repository';

const createRepository = () => {
  const manager = {
    findOne: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
  } as unknown as EntityManager;

  const dataSource = {
    createEntityManager: () => manager,
  } as unknown as DataSource;

  const repository = new CommentReportRepository(dataSource);
  return { repository, manager };
};

describe('CommentReportRepository', () => {
  it('sprawdza czy użytkownik zgłosił komentarz', async () => {
    const { repository, manager } = createRepository();
    (manager.findOne as jest.Mock).mockResolvedValue({ id: 'report' });

    await expect(repository.hasUserAlreadyReported('comment', 'user')).resolves.toBe(true);
    expect(manager.findOne).toHaveBeenCalledWith({
      where: { commentId: 'comment', reporterId: 'user' },
    });
  });

  it('pobiera zgłoszenia konkretnego komentarza', async () => {
    const { repository, manager } = createRepository();
    const reports = [{ id: 'report-1' }];
    (manager.find as jest.Mock).mockResolvedValue(reports);

    await expect(repository.getReportsForComment('comment')).resolves.toBe(reports);
    expect(manager.find).toHaveBeenCalledWith({
      where: { commentId: 'comment' },
      relations: ['reporter'],
      order: { createdAt: 'DESC' },
    });
  });

  it('zwraca liczbę zgłoszeń', async () => {
    const { repository, manager } = createRepository();
    (manager.count as jest.Mock).mockResolvedValue(3);

    await expect(repository.getReportCount('comment')).resolves.toBe(3);
    expect(manager.count).toHaveBeenCalledWith({ where: { commentId: 'comment' } });
  });
});

