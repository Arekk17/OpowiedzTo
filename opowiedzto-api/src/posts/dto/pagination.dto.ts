import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Numer strony (domyślnie 1)',
    minimum: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Liczba elementów na stronę (domyślnie 10, maksymalnie 100)',
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
    description: 'Termin wyszukiwania',
    example: 'życie',
  })
  @IsOptional()
  q?: string;
}

export class PostFiltersDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtrowanie po tagu',
    example: 'życie',
  })
  @IsOptional()
  tag?: string;

  @ApiPropertyOptional({
    description: 'Filtrowanie po autorze (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  authorId?: string;
}
