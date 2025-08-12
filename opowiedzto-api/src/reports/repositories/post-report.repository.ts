import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PostReport } from '../entities/post-report.entity';

@Injectable()
export class PostReportRepository extends Repository<PostReport> {
  constructor(private dataSource: DataSource) {
    super(PostReport, dataSource.createEntityManager());
  }

  async hasUserAlreadyReported(
    postId: string,
    reporterId: string,
  ): Promise<boolean> {
    const report = await this.findOne({
      where: { postId, reporterId },
    });
    return !!report;
  }

  async getReportsForPost(postId: string): Promise<PostReport[]> {
    return this.find({
      where: { postId },
      relations: ['reporter'],
      order: { createdAt: 'DESC' },
    });
  }

  async getReportCount(postId: string): Promise<number> {
    return this.count({
      where: { postId },
    });
  }
}
