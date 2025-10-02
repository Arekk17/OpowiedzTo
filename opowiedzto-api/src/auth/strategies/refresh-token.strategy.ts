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
    console.log(
      '[DEBUG] RefreshTokenStrategy validate called with payload:',
      payload,
    );
    const { tokenId } = payload;
    //

    if (!tokenId || typeof tokenId !== 'string' || tokenId.trim() === '') {
      console.log('[DEBUG] Invalid tokenId format:', tokenId);
      throw new UnauthorizedException('Nieprawidłowy format token ID');
    }

    try {
      console.log('[DEBUG] Looking for refresh token with ID:', tokenId);
      const refreshToken = await this.refreshTokenRepository.findOne({
        where: { id: tokenId, isRevoked: false },
      });

      console.log('[DEBUG] Found refresh token in DB:', refreshToken);

      if (!refreshToken) {
        console.log('[DEBUG] Refresh token not found or revoked');
        throw new UnauthorizedException(
          'Refresh token nie został znaleziony lub został odwołany',
        );
      }

      if (refreshToken.expiresAt < new Date()) {
        console.log('[DEBUG] Refresh token expired:', refreshToken.expiresAt);
        throw new UnauthorizedException('Refresh token wygasł');
      }

      const user = await this.usersService.findOne(refreshToken.userId);

      if (!user) {
        console.log('[DEBUG] User not found for refresh token');
        throw new UnauthorizedException(
          'Użytkownik powiązany z refresh token nie został znaleziony',
        );
      }

      console.log(
        '[DEBUG] Refresh token validation successful for user:',
        user.id,
      );
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
