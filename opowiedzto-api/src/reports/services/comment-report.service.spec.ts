import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { CommentReportService } from './comment-report.service';
import { CommentReportRepository } from '../repositories/comment-report.repository';
import { PostsRepository } from '../../posts/repositories/posts.repository';
import { CommentReport } from '../entities/comment-report.entity';
import { ReportCategory } from '../enums/report-category.enum';

describe('CommentReportService', () => {
  let service: CommentReportService;
  let repository: jest.Mocked<CommentReportRepository>;
  let postsRepository: jest.Mocked<PostsRepository>;

  beforeEach(() => {
    repository = {
      hasUserAlreadyReported: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      getReportsForComment: jest.fn(),
      getReportCount: jest.fn(),
    } as unknown as jest.Mocked<CommentReportRepository>;

    postsRepository = {
      findCommentWithAuthor: jest.fn(),
    } as unknown as jest.Mocked<PostsRepository>;

    service = new CommentReportService(repository, postsRepository);
  });

  describe('createReport', () => {
    const dto = { category: ReportCategory.SPAM, reason: 'Bad content' };
    const comment = { id: 'comment-1', authorId: 'author-1', postId: 'post-1' };

    it('tworzy zgłoszenie, gdy warunki spełnione', async () => {
      postsRepository.findCommentWithAuthor.mockResolvedValue(comment as never);
      repository.hasUserAlreadyReported.mockResolvedValue(false);
      repository.create.mockImplementation((value) => value as CommentReport);
      const saved = { id: 'report-1' } as CommentReport;
      repository.save.mockResolvedValue(saved);

      const result = await service.createReport('comment-1', 'reporter-1', dto);

      expect(repository.create).toHaveBeenCalledWith({
        commentId: 'comment-1',
        reporterId: 'reporter-1',
        category: ReportCategory.SPAM,
        reason: 'Bad content',
      });
      expect(repository.save).toHaveBeenCalled();
      expect(result).toBe(saved);
    });

    it('rzuca NotFound, gdy komentarz nie istnieje', async () => {
      postsRepository.findCommentWithAuthor.mockResolvedValue(null);

      await expect(
        service.createReport('comment-1', 'reporter', dto),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('rzuca Forbidden, gdy reporter jest autorem', async () => {
      postsRepository.findCommentWithAuthor.mockResolvedValue({
        ...comment,
        authorId: 'reporter',
      } as never);

      await expect(
        service.createReport('comment-1', 'reporter', dto),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('rzuca BadRequest, gdy zgłoszenie już istnieje', async () => {
      postsRepository.findCommentWithAuthor.mockResolvedValue(comment as never);
      repository.hasUserAlreadyReported.mockResolvedValue(true);

      await expect(
        service.createReport('comment-1', 'reporter', dto),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('getReportsForComment', () => {
    it('wymaga istnienia komentarza', async () => {
      postsRepository.findCommentWithAuthor.mockResolvedValue(null);

      await expect(
        service.getReportsForComment('missing'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('zwraca zgłoszenia', async () => {
      postsRepository.findCommentWithAuthor.mockResolvedValue({
        id: 'comment',
        authorId: 'author',
      } as never);
      const reports = [{ id: 'report-1' } as CommentReport];
      repository.getReportsForComment.mockResolvedValue(reports);

      await expect(service.getReportsForComment('comment')).resolves.toBe(
        reports,
      );
    });
  });

  it('getReportCount deleguje do repozytorium', async () => {
    repository.getReportCount.mockResolvedValue(3);

    await expect(service.getReportCount('comment')).resolves.toBe(3);
  });
});
