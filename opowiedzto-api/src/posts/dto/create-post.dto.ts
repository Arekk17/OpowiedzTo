import { IsNotEmpty, IsString, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    example: 'Mój pierwszy post',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'To jest przykładowa treść posta',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    example: ['życie', 'refleksja', 'przemyślenia'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tags: string[];
}
