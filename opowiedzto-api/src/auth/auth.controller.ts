import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { GenerateNicknameResponseDto } from './dto/generate-nickname.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Rejestracja nowego użytkownika' })
  @ApiResponse({
    status: 201,
    description: 'Użytkownik został zarejestrowany pomyślnie',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email już istnieje w systemie',
  })
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    return this.authService.register(registerDto, res);
  }

  @ApiOperation({ summary: 'Logowanie użytkownika' })
  @ApiResponse({
    status: 200,
    description: 'Użytkownik został zalogowany pomyślnie',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Nieprawidłowy email lub hasło',
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    return this.authService.login(loginDto, res);
  }

  @ApiOperation({ summary: 'Pobranie danych zalogowanego użytkownika' })
  @ApiResponse({
    status: 200,
    description: 'Dane użytkownika zostały pobrane pomyślnie',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: 'Brak autoryzacji',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@GetUser() user: User) {
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      createdAt: user.createdAt,
    };
  }

  @ApiOperation({ summary: 'Generowanie unikalnego nicknames' })
  @ApiResponse({
    status: 200,
    description: 'Nickname został wygenerowany pomyślnie',
    type: GenerateNicknameResponseDto,
  })
  @Get('generate-nickname')
  async generateNickname(): Promise<GenerateNicknameResponseDto> {
    const nickname = await this.authService.generateNickname();
    return { nickname };
  }
}
