import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token JWT do autoryzacji',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'ID użytkownika',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({ example: 'Anonymous1234' })
  nickname: string;

  @ApiProperty({
    description: 'Aktualny czas serwera (timestamp w milisekundach)',
    example: 1759400436000,
  })
  serverTime: number;

  @ApiProperty({
    description: 'Czas wygaśnięcia access tokenu (timestamp w milisekundach)',
    example: 1759400436000,
  })
  expiresAt: number;
}
