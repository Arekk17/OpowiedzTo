import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    const secretKey =
      process.env.JWT_SECRET ||
      (() => {
        if (process.env.NODE_ENV === 'production') {
          throw new Error(
            'JWT_SECRET must be defined in production environment',
          );
        }
        return 'dev_secret_only_for_development';
      })();

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const cookies = request.headers.cookie;
          if (cookies) {
            const cookieArray = cookies.split(';');
            for (const cookie of cookieArray) {
              const [name, value] = cookie.trim().split('=');
              if (name === 'accessToken') {
                return value;
              }
            }
          }
          return null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: secretKey,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { userId } = payload;
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('Użytkownik nie został znaleziony');
    }
    return user;
  }
}
