import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CommentReport } from '../entities/comment-report.entity';

@Injectable()
export class CommentReportRepository extends Repository<CommentReport> {
  constructor(private dataSource: DataSource) {
    super(CommentReport, dataSource.createEntityManager());
  }

  async hasUserAlreadyReported(
    commentId: string,
    reporterId: string,
  ): Promise<boolean> {
    const report = await this.findOne({
      where: { commentId, reporterId },
    });
    return !!report;
  }

  async getReportsForComment(commentId: string): Promise<CommentReport[]> {
    return this.find({
      where: { commentId },
      relations: ['reporter'],
      order: { createdAt: 'DESC' },
    });
  }

  async getReportCount(commentId: string): Promise<number> {
    return this.count({
      where: { commentId },
    });
  }
}
