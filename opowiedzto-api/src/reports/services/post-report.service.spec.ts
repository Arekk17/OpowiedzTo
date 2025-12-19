import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { PostReportService } from './post-report.service';
import { PostReportRepository } from '../repositories/post-report.repository';
import { PostsRepository } from '../../posts/repositories/posts.repository';
import { PostReport } from '../entities/post-report.entity';
import { ReportCategory } from '../enums/report-category.enum';

describe('PostReportService', () => {
  let service: PostReportService;
  let repository: jest.Mocked<PostReportRepository>;
  let postsRepository: jest.Mocked<PostsRepository>;

  beforeEach(() => {
    repository = {
      hasUserAlreadyReported: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      getReportsForPost: jest.fn(),
      getReportCount: jest.fn(),
    } as unknown as jest.Mocked<PostReportRepository>;

    postsRepository = {
      findEntityById: jest.fn(),
    } as unknown as jest.Mocked<PostsRepository>;

    service = new PostReportService(repository, postsRepository);
  });

  describe('createReport', () => {
    const dto = { category: ReportCategory.SPAM, reason: 'Bad content' };
    const post = { id: 'post-1', authorId: 'author-1' };

    it('tworzy zgłoszenie dla posta', async () => {
      postsRepository.findEntityById.mockResolvedValue(post as never);
      repository.hasUserAlreadyReported.mockResolvedValue(false);
      repository.create.mockImplementation((value) => value as PostReport);
      const saved = { id: 'report-1' } as PostReport;
      repository.save.mockResolvedValue(saved);

      const result = await service.createReport('post-1', 'reporter', dto);

      expect(repository.create).toHaveBeenCalledWith({
        postId: 'post-1',
        reporterId: 'reporter',
        category: ReportCategory.SPAM,
        reason: 'Bad content',
      });
      expect(result).toBe(saved);
    });

    it('rzuca NotFound, gdy post nie istnieje', async () => {
      postsRepository.findEntityById.mockResolvedValue(null);

      await expect(
        service.createReport('post-1', 'reporter', dto),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('rzuca Forbidden, gdy autor zgłasza swój post', async () => {
      postsRepository.findEntityById.mockResolvedValue({
        ...post,
        authorId: 'reporter',
      } as never);

      await expect(
        service.createReport('post-1', 'reporter', dto),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('rzuca BadRequest, gdy zgłoszenie już istnieje', async () => {
      postsRepository.findEntityById.mockResolvedValue(post as never);
      repository.hasUserAlreadyReported.mockResolvedValue(true);

      await expect(
        service.createReport('post-1', 'reporter', dto),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('getReportsForPost', () => {
    it('wymaga istnienia posta', async () => {
      postsRepository.findEntityById.mockResolvedValue(null);

      await expect(service.getReportsForPost('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('zwraca raporty', async () => {
      postsRepository.findEntityById.mockResolvedValue({
        id: 'post-1',
        authorId: 'author',
      } as never);
      const reports = [{ id: 'report-1' } as PostReport];
      repository.getReportsForPost.mockResolvedValue(reports);

      await expect(service.getReportsForPost('post-1')).resolves.toBe(reports);
    });
  });

  it('getReportCount deleguje do repozytorium', async () => {
    repository.getReportCount.mockResolvedValue(2);

    await expect(service.getReportCount('post')).resolves.toBe(2);
  });
});
