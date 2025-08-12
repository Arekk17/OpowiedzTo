import { ApiProperty } from '@nestjs/swagger';

export class GenerateNicknameResponseDto {
  @ApiProperty({
    description: 'Wygenerowany unikalny nickname',
    example: 'Anonymous1234',
  })
  nickname: string;
}
