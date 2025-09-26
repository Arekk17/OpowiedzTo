import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class TrendingTagDto {
  @ApiProperty({ example: 'tag1' })
  @IsString()
  tag: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  count: number;
}
