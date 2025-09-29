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
import { RefreshToken } from './entities/refresh-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
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
    const refreshToken = await this.generateRefreshToken(user);
    this.setRefreshCookie(res, refreshToken);

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
    const refreshToken = await this.generateRefreshToken(user);
    this.setRefreshCookie(res, refreshToken);

    this.setAuthCookie(res, token.accessToken);

    return token;
  }

  async logout(user: User, res: Response): Promise<{ message: string }> {
    await this.refreshTokenRepository.update(
      { userId: user.id, isRevoked: false },
      { isRevoked: true, revokedAt: new Date() },
    );
    this.clearAuthCookie(res);
    this.clearRefreshCookie(res);
    return { message: 'Wylogowano pomyślnie' };
  }

  async generateRefreshToken(
    user: User,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<string> {
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const refreshToken = this.refreshTokenRepository.create({
        userId: user.id,
        expiresAt,
        userAgent,
        ipAddress,
      });

      const savedRefreshToken =
        await this.refreshTokenRepository.save(refreshToken);
      await this.refreshTokenRepository.update(
        {
          userId: user.id,
          isRevoked: false,
          createdAt: LessThan(savedRefreshToken.createdAt),
        },
        { isRevoked: true, revokedAt: new Date() },
      );

      const refreshTokenJWT = this.jwtService.sign(
        {
          tokenId: savedRefreshToken.id,
          email: user.email,
          nickname: user.nickname,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret',
          expiresIn: '7d',
        },
      );

      return refreshTokenJWT;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Błąd podczas generowania refresh token',
      );
    }
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
    const crossSite = process.env.CROSS_SITE_COOKIES === 'true';

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: isProduction ? true : false,
      sameSite: crossSite ? 'none' : isProduction ? 'lax' : 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });
  }

  private setRefreshCookie(res: Response, token: string): void {
    const isProduction = process.env.NODE_ENV === 'production';
    const crossSite = process.env.CROSS_SITE_COOKIES === 'true';

    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: isProduction ? true : false,
      sameSite: crossSite ? 'none' : isProduction ? 'lax' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }

  private clearAuthCookie(res: Response): void {
    const isProduction = process.env.NODE_ENV === 'production';
    const crossSite = process.env.CROSS_SITE_COOKIES === 'true';

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: isProduction ? true : false,
      sameSite: crossSite ? 'none' : isProduction ? 'lax' : 'lax',
      path: '/',
    });
  }

  private clearRefreshCookie(res: Response): void {
    const isProduction = process.env.NODE_ENV === 'production';
    const crossSite = process.env.CROSS_SITE_COOKIES === 'true';

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProduction ? true : false,
      sameSite: crossSite ? 'none' : isProduction ? 'lax' : 'lax',
      path: '/',
    });
  }

  async refreshTokens(user: User, res: Response): Promise<AuthResponseDto> {
    const newAccessToken = this.generateToken(user);
    const newRefreshToken = await this.generateRefreshToken(user);

    this.setAuthCookie(res, newAccessToken.accessToken);
    this.setRefreshCookie(res, newRefreshToken);

    return newAccessToken;
  }
}
