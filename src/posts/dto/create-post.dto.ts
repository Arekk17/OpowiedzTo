import { IsNotEmpty, IsString, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'ID autora posta',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  authorId: string;

  @ApiProperty({
    description: 'Treść posta',
    example: 'To jest przykładowa treść posta',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Tagi posta',
    example: ['życie', 'refleksja', 'przemyślenia'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tags: string[];
}
