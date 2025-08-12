import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    const secretKey = process.env.JWT_SECRET || 'dev_secret';

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretKey,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    console.log('JWT payload:', payload);
    const { userId } = payload;
    const user = await this.usersService.findOne(userId);
    console.log('User found for token:', user);
    if (!user) {
      console.log('User not found for token!');
      throw new UnauthorizedException('Użytkownik nie został znaleziony');
    }
    return user;
  }
}
