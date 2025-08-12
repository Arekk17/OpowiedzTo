import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PostReportRepository } from '../repositories/post-report.repository';
import { PostRepository } from '../../posts/repositories/post.repository';
import { PostReport } from '../entities/post-report.entity';
import { CreateReportDto } from '../dto/create-report.dto';

@Injectable()
export class PostReportService {
  constructor(
    private readonly postReportRepository: PostReportRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async createReport(
    postId: string,
    reporterId: string,
    createReportDto: CreateReportDto,
  ): Promise<PostReport> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post nie istnieje');
    }

    if (post.authorId === reporterId) {
      throw new ForbiddenException('Nie możesz zgłosić własnego posta');
    }

    const hasReported = await this.postReportRepository.hasUserAlreadyReported(
      postId,
      reporterId,
    );
    if (hasReported) {
      throw new BadRequestException('Już zgłosiłeś ten post');
    }

    const report = this.postReportRepository.create({
      postId,
      reporterId,
      category: createReportDto.category,
      reason: createReportDto.reason,
    });

    return this.postReportRepository.save(report);
  }

  async getReportsForPost(postId: string): Promise<PostReport[]> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post nie istnieje');
    }

    return this.postReportRepository.getReportsForPost(postId);
  }

  async getReportCount(postId: string): Promise<number> {
    return this.postReportRepository.getReportCount(postId);
  }
}
