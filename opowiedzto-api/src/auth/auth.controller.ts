import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
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
import { RefreshTokenAuthGuard } from './guards/refresh-token-auth.guard';

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
    @Req() req: Request,
  ): Promise<AuthResponseDto> {
    return this.authService.register(registerDto, res, req);
  }
  @Post('refresh-token')
  @UseGuards(RefreshTokenAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Odświeżenie tokenu' })
  @ApiResponse({
    status: 200,
    description: 'Token został odświeżony pomyślnie',
  })
  @ApiResponse({
    status: 401,
    description: 'Brak autoryzacji',
  })
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  @UseGuards(RefreshTokenAuthGuard)
  @ApiBearerAuth()
  refreshToken(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshTokens(user, res);
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
    @Req() req: Request,
  ): Promise<AuthResponseDto> {
    return this.authService.login(loginDto, res, req);
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
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Wyloguj użytkownika' })
  @ApiResponse({
    status: 200,
    description: 'Użytkownik został wylogowany',
  })
  async logout(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    return this.authService.logout(user, res);
  }
}
