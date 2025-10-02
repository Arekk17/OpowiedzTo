import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokenPayload } from '../interfaces/refresh-token-payload.interface';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { RefreshToken } from '../entities/refresh-token.entity';
import { extractCookieValue } from '../utils/cookie-parser.util';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {
    const refreshSecretKey = RefreshTokenStrategy.getRefreshSecretKey();

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => extractCookieValue(request, 'refreshToken'),
      ]),
      ignoreExpiration: false,
      secretOrKey: refreshSecretKey,
    });
  }

  private static getRefreshSecretKey(): string {
    const secret = process.env.JWT_REFRESH_SECRET;

    if (!secret) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(
          'JWT_REFRESH_SECRET must be defined in production environment',
        );
      }
      return 'dev_refresh_secret';
    }

    return secret;
  }

  async validate(payload: RefreshTokenPayload): Promise<User> {
    const { tokenId } = payload;
    //

    if (!tokenId || typeof tokenId !== 'string' || tokenId.trim() === '') {
      throw new UnauthorizedException('Nieprawidłowy format token ID');
    }

    try {
      const refreshToken = await this.refreshTokenRepository.findOne({
        where: { id: tokenId, isRevoked: false },
      });

      if (!refreshToken) {
        throw new UnauthorizedException(
          'Refresh token nie został znaleziony lub został odwołany',
        );
      }

      if (refreshToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh token wygasł');
      }

      const user = await this.usersService.findOne(refreshToken.userId);

      if (!user) {
        throw new UnauthorizedException(
          'Użytkownik powiązany z refresh token nie został znaleziony',
        );
      }

      return user;
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      console.error('Error validating refresh token:', error);
      throw new UnauthorizedException('Błąd podczas walidacji refresh token');
    }
  }
}
