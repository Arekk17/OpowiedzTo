import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

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

  @ApiProperty({ type: () => User })
  author: User;

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
