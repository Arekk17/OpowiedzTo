import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
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

    return this.generateToken(user);
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Nieprawidłowy email lub hasło');
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Nieprawidłowy email lub hasło');
    }

    return this.generateToken(user);
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
}
