import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({
    minimum: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 100,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class SearchDto extends PaginationDto {
  @ApiPropertyOptional({
    example: 'życie',
  })
  @IsOptional()
  q?: string;
}

export class PostFiltersDto extends PaginationDto {
  @ApiPropertyOptional({
    example: 'życie',
  })
  @IsOptional()
  tag?: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  authorId?: string;
}
