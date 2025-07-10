import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommentReportService } from '../services/comment-report.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateReportDto } from '../dto/create-report.dto';
import { CommentReport } from '../entities/comment-report.entity';

interface RequestWithUser extends Request {
  user: {
    id: string;
  };
}

@ApiTags('comment-reports')
@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentReportController {
  constructor(private readonly commentReportService: CommentReportService) {}

  @Post(':id/report')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Zgłoś komentarz' })
  @ApiResponse({
    status: 201,
    description: 'Komentarz został zgłoszony',
    type: CommentReport,
  })
  @ApiResponse({ status: 400, description: 'Nieprawidłowe żądanie' })
  @ApiResponse({ status: 403, description: 'Brak uprawnień' })
  @ApiResponse({ status: 404, description: 'Komentarz nie znaleziony' })
  async reportComment(
    @Param('id') commentId: string,
    @Body() createReportDto: CreateReportDto,
    @Request() req: RequestWithUser,
  ): Promise<CommentReport> {
    return this.commentReportService.createReport(
      commentId,
      req.user.id,
      createReportDto,
    );
  }

  @Get(':id/reports')
  @ApiOperation({ summary: 'Pobierz zgłoszenia komentarza' })
  @ApiResponse({
    status: 200,
    description: 'Lista zgłoszeń',
    type: [CommentReport],
  })
  @ApiResponse({ status: 404, description: 'Komentarz nie znaleziony' })
  async getReports(@Param('id') commentId: string): Promise<CommentReport[]> {
    return this.commentReportService.getReportsForComment(commentId);
  }

  @Get(':id/reports/count')
  @ApiOperation({ summary: 'Pobierz liczbę zgłoszeń komentarza' })
  @ApiResponse({ status: 200, description: 'Liczba zgłoszeń' })
  async getReportCount(
    @Param('id') commentId: string,
  ): Promise<{ count: number }> {
    const count = await this.commentReportService.getReportCount(commentId);
    return { count };
  }
}
