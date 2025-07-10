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
import { PostReportService } from '../services/post-report.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateReportDto } from '../dto/create-report.dto';
import { PostReport } from '../entities/post-report.entity';

interface RequestWithUser extends Request {
  user: {
    id: string;
  };
}

@ApiTags('post-reports')
@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostReportController {
  constructor(private readonly postReportService: PostReportService) {}

  @Post(':id/report')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Zgłoś post' })
  @ApiResponse({
    status: 201,
    description: 'Post został zgłoszony',
    type: PostReport,
  })
  @ApiResponse({ status: 400, description: 'Nieprawidłowe żądanie' })
  @ApiResponse({ status: 403, description: 'Brak uprawnień' })
  @ApiResponse({ status: 404, description: 'Post nie znaleziony' })
  async reportPost(
    @Param('id') postId: string,
    @Body() createReportDto: CreateReportDto,
    @Request() req: RequestWithUser,
  ): Promise<PostReport> {
    return this.postReportService.createReport(
      postId,
      req.user.id,
      createReportDto,
    );
  }

  @Get(':id/reports')
  @ApiOperation({ summary: 'Pobierz zgłoszenia posta' })
  @ApiResponse({
    status: 200,
    description: 'Lista zgłoszeń',
    type: [PostReport],
  })
  @ApiResponse({ status: 404, description: 'Post nie znaleziony' })
  async getReports(@Param('id') postId: string): Promise<PostReport[]> {
    return this.postReportService.getReportsForPost(postId);
  }

  @Get(':id/reports/count')
  @ApiOperation({ summary: 'Pobierz liczbę zgłoszeń posta' })
  @ApiResponse({ status: 200, description: 'Liczba zgłoszeń' })
  async getReportCount(
    @Param('id') postId: string,
  ): Promise<{ count: number }> {
    const count = await this.postReportService.getReportCount(postId);
    return { count };
  }
}
