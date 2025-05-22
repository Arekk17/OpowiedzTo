import { IsString, IsArray, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({
    description: 'ID autora posta (wymagane do weryfikacji)',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  authorId: string;

  @ApiProperty({
    description: 'Treść posta',
    example: 'Zaktualizowana treść posta',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'Tagi posta',
    example: ['życie', 'refleksja', 'zmiana'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
