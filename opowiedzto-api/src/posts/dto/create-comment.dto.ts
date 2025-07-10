import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'Świetny post!',
    description: 'Treść komentarza',
  })
  @IsString()
  @MinLength(1, { message: 'Komentarz nie może być pusty' })
  @MaxLength(1000, {
    message: 'Komentarz nie może być dłuższy niż 1000 znaków',
  })
  content: string;
}
