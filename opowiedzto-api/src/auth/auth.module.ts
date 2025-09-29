import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from './guards/optional-jwt-auth.guard';
import { UsersModule } from '../users/users.module';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([RefreshToken]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret:
        process.env.JWT_SECRET ||
        (() => {
          if (process.env.NODE_ENV === 'production') {
            throw new Error(
              'JWT_SECRET must be defined in production environment',
            );
          }
          return 'dev_secret_only_for_development';
        })(),
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION_TIME || '15m',
      },
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    OptionalJwtAuthGuard,
    RefreshTokenStrategy,
  ],
  exports: [
    JwtStrategy,
    PassportModule,
    JwtAuthGuard,
    OptionalJwtAuthGuard,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
