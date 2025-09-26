import { ApiProperty } from '@nestjs/swagger';

export class AuthorDto {
  @ApiProperty({ example: 'uuid-v4' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'AnonymousUser123' })
  nickname: string;

  @ApiProperty({ example: 'male' })
  gender: string;

  @ApiProperty({ example: '2024-01-01T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T12:00:00Z' })
  updatedAt: Date;

  @ApiProperty({ example: 'avatars/user123_1234567890.jpg', required: false })
  avatar?: string;
}
