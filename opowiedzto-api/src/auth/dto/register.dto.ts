import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  Matches,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../users/entities/user.entity';

export class RegisterDto {
  @ApiProperty({
    description: 'Email użytkownika',
    example: 'test@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Hasło użytkownika (min. 8 znaków)',
    example: 'Test1234',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Hasło musi zawierać małe i wielkie litery, cyfry lub znaki specjalne',
  })
  password: string;

  @ApiProperty({
    description:
      'Nickname użytkownika (opcjonalny - jeśli nie podany, zostanie wygenerowany)',
    example: 'AnonymousUser123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_-]{3,20}$/, {
    message:
      'Nickname może zawierać tylko litery, cyfry, podkreślenia i myślniki (3-20 znaków)',
  })
  nickname?: string;

  @ApiProperty({
    description: 'Płeć użytkownika',
    enum: Gender,
    example: Gender.OTHER,
    required: false,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
