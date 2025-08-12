import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostReport } from './entities/post-report.entity';
import { CommentReport } from './entities/comment-report.entity';
import { PostReportService } from './services/post-report.service';
import { CommentReportService } from './services/comment-report.service';
import { PostReportController } from './controllers/post-report.controller';
import { CommentReportController } from './controllers/comment-report.controller';
import { PostReportRepository } from './repositories/post-report.repository';
import { CommentReportRepository } from './repositories/comment-report.repository';
import { PostRepository } from '../posts/repositories/post.repository';
import { CommentRepository } from '../posts/repositories/comment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PostReport, CommentReport])],
  controllers: [PostReportController, CommentReportController],
  providers: [
    PostReportService,
    CommentReportService,
    PostReportRepository,
    CommentReportRepository,
    PostRepository,
    CommentRepository,
  ],
  exports: [PostReportService, CommentReportService],
})
export class ReportsModule {}
