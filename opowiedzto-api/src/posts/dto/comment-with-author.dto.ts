import { ApiProperty } from '@nestjs/swagger';
import { AuthorDto } from './author.dto';

export class CommentWithAuthorDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  authorId: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: () => AuthorDto })
  author: AuthorDto;
}
