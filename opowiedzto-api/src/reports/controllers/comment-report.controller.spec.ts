import { CommentReportController } from './comment-report.controller';
import { CommentReportService } from '../services/comment-report.service';
import { CommentReport } from '../entities/comment-report.entity';

describe('CommentReportController', () => {
  let controller: CommentReportController;
  let service: jest.Mocked<CommentReportService>;

  beforeEach(() => {
    service = {
      createReport: jest.fn(),
      getReportsForComment: jest.fn(),
      getReportCount: jest.fn(),
    } as unknown as jest.Mocked<CommentReportService>;

    controller = new CommentReportController(service);
  });

  it('reportComment deleguje do serwisu', async () => {
    const dto = { category: 'spam', reason: 'spam' } as never;
    const report = { id: 'report-1' } as CommentReport;
    service.createReport.mockResolvedValue(report);

    await expect(
      controller.reportComment('comment-1', dto, { id: 'user-1' } as never),
    ).resolves.toBe(report);
    expect(service.createReport).toHaveBeenCalledWith('comment-1', 'user-1', dto);
  });

  it('getReports deleguje do serwisu', async () => {
    const reports = [{ id: 'report-1' } as CommentReport];
    service.getReportsForComment.mockResolvedValue(reports);

    await expect(controller.getReports('comment-1')).resolves.toBe(reports);
  });

  it('getReportCount zwraca liczbę zgłoszeń', async () => {
    service.getReportCount.mockResolvedValue(3);

    await expect(controller.getReportCount('comment-1')).resolves.toEqual({ count: 3 });
  });
});



