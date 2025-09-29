import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CommentReportService } from '../services/comment-report.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { User } from '../../users/entities/user.entity';
import { CreateReportDto } from '../dto/create-report.dto';
import { CommentReport } from '../entities/comment-report.entity';

@ApiTags('comment-reports')
@Controller('comments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommentReportController {
  constructor(private readonly commentReportService: CommentReportService) {}

  @Post(':id/report')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Zgłoś komentarz' })
  @ApiParam({ name: 'id', description: 'ID komentarza' })
  @ApiResponse({
    status: 201,
    description: 'Komentarz został zgłoszony',
    type: CommentReport,
  })
  @ApiResponse({ status: 400, description: 'Nieprawidłowe żądanie' })
  @ApiResponse({ status: 403, description: 'Brak uprawnień' })
  @ApiResponse({ status: 404, description: 'Komentarz nie znaleziony' })
  async reportComment(
    @Param('id', ParseUUIDPipe) commentId: string,
    @Body() createReportDto: CreateReportDto,
    @GetUser() user: User,
  ): Promise<CommentReport> {
    return this.commentReportService.createReport(
      commentId,
      user.id,
      createReportDto,
    );
  }

  @Get(':id/reports')
  @ApiOperation({ summary: 'Pobierz zgłoszenia komentarza' })
  @ApiParam({ name: 'id', description: 'ID komentarza' })
  @ApiResponse({
    status: 200,
    description: 'Lista zgłoszeń',
    type: [CommentReport],
  })
  @ApiResponse({ status: 404, description: 'Komentarz nie znaleziony' })
  async getReports(
    @Param('id', ParseUUIDPipe) commentId: string,
  ): Promise<CommentReport[]> {
    return this.commentReportService.getReportsForComment(commentId);
  }

  @Get(':id/reports/count')
  @ApiOperation({ summary: 'Pobierz liczbę zgłoszeń komentarza' })
  @ApiParam({ name: 'id', description: 'ID komentarza' })
  @ApiResponse({ status: 200, description: 'Liczba zgłoszeń' })
  async getReportCount(
    @Param('id', ParseUUIDPipe) commentId: string,
  ): Promise<{ count: number }> {
    const count = await this.commentReportService.getReportCount(commentId);
    return { count };
  }
}
