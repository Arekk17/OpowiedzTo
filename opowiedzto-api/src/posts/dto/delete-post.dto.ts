import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeletePostDto {
  @ApiProperty({
    description: 'ID autora posta (wymagane do weryfikacji)',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  authorId: string;
}
