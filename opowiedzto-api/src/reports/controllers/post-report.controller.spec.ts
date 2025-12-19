import { PostReportController } from './post-report.controller';
import { PostReportService } from '../services/post-report.service';
import { PostReport } from '../entities/post-report.entity';

describe('PostReportController', () => {
  let controller: PostReportController;
  let service: jest.Mocked<PostReportService>;

  beforeEach(() => {
    service = {
      createReport: jest.fn(),
      getReportsForPost: jest.fn(),
      getReportCount: jest.fn(),
    } as unknown as jest.Mocked<PostReportService>;

    controller = new PostReportController(service);
  });

  it('reportPost deleguje do serwisu', async () => {
    const dto = { category: 'spam', reason: 'spam' } as never;
    const report = { id: 'report-1' } as PostReport;
    service.createReport.mockResolvedValue(report);

    await expect(controller.reportPost('post-1', dto, { id: 'user-1' } as never)).resolves.toBe(
      report,
    );
    expect(service.createReport).toHaveBeenCalledWith('post-1', 'user-1', dto);
  });

  it('getReports deleguje do serwisu', async () => {
    const reports = [{ id: 'report-1' } as PostReport];
    service.getReportsForPost.mockResolvedValue(reports);

    await expect(controller.getReports('post-1')).resolves.toBe(reports);
  });

  it('getReportCount zwraca liczbę zgłoszeń', async () => {
    service.getReportCount.mockResolvedValue(2);

    await expect(controller.getReportCount('post-1')).resolves.toEqual({ count: 2 });
  });
});



