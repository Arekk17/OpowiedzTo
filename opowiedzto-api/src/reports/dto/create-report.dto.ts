import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, MinLength, MaxLength } from 'class-validator';
import { ReportCategory } from '../enums/report-category.enum';

export class CreateReportDto {
  @ApiProperty({
    enum: ReportCategory,
    description: 'Kategoria zgłoszenia',
    example: ReportCategory.OFFENSIVE,
  })
  @IsEnum(ReportCategory)
  category: ReportCategory;

  @ApiProperty({
    description: 'Szczegółowy powód zgłoszenia',
    example: 'Post zawiera obraźliwe treści',
    minLength: 10,
    maxLength: 500,
  })
  @IsString()
  @MinLength(10, { message: 'Powód zgłoszenia musi mieć minimum 10 znaków' })
  @MaxLength(500, {
    message: 'Powód zgłoszenia nie może przekraczać 500 znaków',
  })
  reason: string;
}
