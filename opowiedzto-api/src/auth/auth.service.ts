import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(
    registerDto: RegisterDto,
    res: Response,
  ): Promise<AuthResponseDto> {
    const { email, password, nickname, gender } = registerDto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email już istnieje w systemie');
    }

    const user = await this.usersService.create(
      email,
      password,
      nickname,
      gender,
    );

    const token = this.generateToken(user);

    this.setAuthCookie(res, token.accessToken);

    return token;
  }

  async login(loginDto: LoginDto, res: Response): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Nieprawidłowy email lub hasło');
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Nieprawidłowy email lub hasło');
    }

    const token = this.generateToken(user);

    this.setAuthCookie(res, token.accessToken);

    return token;
  }

  logout(res: Response): { message: string } {
    this.clearAuthCookie(res);

    return { message: 'Wylogowano pomyślnie' };
  }

  async generateNickname(): Promise<string> {
    try {
      return await this.usersService.generateUniqueNickname();
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Błąd podczas generowania nicknames',
      );
    }
  }

  private generateToken(user: User): AuthResponseDto {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      nickname: user.nickname,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      userId: user.id,
      nickname: user.nickname,
    };
  }

  private setAuthCookie(res: Response, token: string): void {
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });
  }

  private clearAuthCookie(res: Response): void {
    const isProduction = process.env.NODE_ENV === 'production';

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      path: '/',
    });
  }
}
