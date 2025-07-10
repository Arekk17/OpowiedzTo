import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { User, Gender } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(
        `Użytkownik o ID ${id} nie został znaleziony`,
      );
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findByEmail(email);
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

      const existingUser = await this.userRepository.findByNickname(nickname);

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
      const existingUser =
        await this.userRepository.findByNickname(finalNickname);
      if (existingUser) {
        throw new ConflictException('Ten nickname jest już zajęty');
      }
    }

    const user = this.userRepository.create({
      email,
      password,
      nickname: finalNickname,
      gender: gender || Gender.OTHER,
    });
    return this.userRepository.save(user);
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);

    if (updateData.nickname) {
      const existingUser = await this.userRepository.findByNickname(
        updateData.nickname,
      );
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Ten nickname jest już zajęty');
      }
    }

    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }
  async uploadAvatar(userId: string, avatarPath: string): Promise<void> {
    const user = await this.findOne(userId);
    user.avatar = avatarPath;
    await this.userRepository.save(user);
  }

  async updateAvatar(id: string, avatarPath: string): Promise<User> {
    const user = await this.findOne(id);
    user.avatar = avatarPath;
    return this.userRepository.save(user);
  }
}
