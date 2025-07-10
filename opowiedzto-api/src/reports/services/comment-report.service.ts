import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CommentReportRepository } from '../repositories/comment-report.repository';
import { CommentRepository } from '../../posts/repositories/comment.repository';
import { CommentReport } from '../entities/comment-report.entity';
import { CreateReportDto } from '../dto/create-report.dto';

@Injectable()
export class CommentReportService {
  constructor(
    private readonly commentReportRepository: CommentReportRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  async createReport(
    commentId: string,
    reporterId: string,
    createReportDto: CreateReportDto,
  ): Promise<CommentReport> {
    const comment = await this.commentRepository.findWithAuthor(commentId);
    if (!comment) {
      throw new NotFoundException('Komentarz nie istnieje');
    }

    if (comment.authorId === reporterId) {
      throw new ForbiddenException('Nie możesz zgłosić własnego komentarza');
    }

    const hasReported =
      await this.commentReportRepository.hasUserAlreadyReported(
        commentId,
        reporterId,
      );
    if (hasReported) {
      throw new BadRequestException('Już zgłosiłeś ten komentarz');
    }

    const report = this.commentReportRepository.create({
      commentId,
      reporterId,
      category: createReportDto.category,
      reason: createReportDto.reason,
    });

    return this.commentReportRepository.save(report);
  }

  async getReportsForComment(commentId: string): Promise<CommentReport[]> {
    const comment = await this.commentRepository.findWithAuthor(commentId);
    if (!comment) {
      throw new NotFoundException('Komentarz nie istnieje');
    }

    return this.commentReportRepository.getReportsForComment(commentId);
  }

  async getReportCount(commentId: string): Promise<number> {
    return this.commentReportRepository.getReportCount(commentId);
  }
}
