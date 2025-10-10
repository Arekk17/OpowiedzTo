import { ApiProperty } from '@nestjs/swagger';
import { AuthorDto } from './author.dto';
import { CommentWithAuthorDto } from './comment-with-author.dto';
import { TagResponseDto } from '../../tags/dto/tag-response.dto';
import { IsOptional } from 'class-validator';

export class PostWithDetailsDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ type: [TagResponseDto] })
  tags: TagResponseDto[];

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

  @ApiProperty({ type: () => [CommentWithAuthorDto] })
  @IsOptional()
  latestComments: CommentWithAuthorDto[];
}
