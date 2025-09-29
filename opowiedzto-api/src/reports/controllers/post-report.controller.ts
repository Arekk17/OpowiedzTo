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
import { PostReportService } from '../services/post-report.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { User } from '../../users/entities/user.entity';
import { CreateReportDto } from '../dto/create-report.dto';
import { PostReport } from '../entities/post-report.entity';

@ApiTags('post-reports')
@Controller('posts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PostReportController {
  constructor(private readonly postReportService: PostReportService) {}

  @Post(':id/report')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Zgłoś post' })
  @ApiParam({ name: 'id', description: 'ID posta' })
  @ApiResponse({
    status: 201,
    description: 'Post został zgłoszony',
    type: PostReport,
  })
  @ApiResponse({ status: 400, description: 'Nieprawidłowe żądanie' })
  @ApiResponse({ status: 403, description: 'Brak uprawnień' })
  @ApiResponse({ status: 404, description: 'Post nie znaleziony' })
  async reportPost(
    @Param('id', ParseUUIDPipe) postId: string,
    @Body() createReportDto: CreateReportDto,
    @GetUser() user: User,
  ): Promise<PostReport> {
    return this.postReportService.createReport(
      postId,
      user.id,
      createReportDto,
    );
  }

  @Get(':id/reports')
  @ApiOperation({ summary: 'Pobierz zgłoszenia posta' })
  @ApiParam({ name: 'id', description: 'ID posta' })
  @ApiResponse({
    status: 200,
    description: 'Lista zgłoszeń',
    type: [PostReport],
  })
  @ApiResponse({ status: 404, description: 'Post nie znaleziony' })
  async getReports(
    @Param('id', ParseUUIDPipe) postId: string,
  ): Promise<PostReport[]> {
    return this.postReportService.getReportsForPost(postId);
  }

  @Get(':id/reports/count')
  @ApiOperation({ summary: 'Pobierz liczbę zgłoszeń posta' })
  @ApiParam({ name: 'id', description: 'ID posta' })
  @ApiResponse({ status: 200, description: 'Liczba zgłoszeń' })
  async getReportCount(
    @Param('id', ParseUUIDPipe) postId: string,
  ): Promise<{ count: number }> {
    const count = await this.postReportService.getReportCount(postId);
    return { count };
  }
}
