import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Gender } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(
        `Użytkownik o ID ${id} nie został znaleziony`,
      );
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async generateUniqueNickname(): Promise<string> {
    const prefix = 'Anonymous';
    let nickname: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      attempts++;
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      nickname = `${prefix}${randomNum}`;

      const existingUser = await this.usersRepository.findOne({
        where: { nickname },
      });

      if (!existingUser) {
        isUnique = true;
      }
    }

    if (!isUnique) {
      throw new ConflictException(
        'Nie udało się wygenerować unikalnego nicknames',
      );
    }

    return nickname;
  }

  async create(
    email: string,
    password: string,
    nickname?: string,
    gender?: Gender,
  ): Promise<User> {
    const finalNickname = nickname || (await this.generateUniqueNickname());

    if (nickname) {
      const existingUser = await this.usersRepository.findOne({
        where: { nickname: finalNickname },
      });
      if (existingUser) {
        throw new ConflictException('Ten nickname jest już zajęty');
      }
    }

    const user = this.usersRepository.create({
      email,
      password,
      nickname: finalNickname,
      gender: gender || Gender.OTHER,
    });
    return this.usersRepository.save(user);
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);

    if (updateData.nickname) {
      const existingUser = await this.usersRepository.findOne({
        where: { nickname: updateData.nickname },
      });
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Ten nickname jest już zajęty');
      }
    }

    Object.assign(user, updateData);
    return this.usersRepository.save(user);
  }
}
