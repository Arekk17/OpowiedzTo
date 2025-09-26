import { ApiProperty } from '@nestjs/swagger';
import { AuthorDto } from './author.dto';

export class PostWithDetailsDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty()
  authorId: string;

  @ApiProperty({ type: () => AuthorDto })
  author: AuthorDto;

  @ApiProperty()
  commentsCount: number;

  @ApiProperty()
  likesCount: number;

  @ApiProperty()
  isLiked: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
