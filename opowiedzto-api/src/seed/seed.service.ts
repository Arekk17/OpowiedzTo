import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    const postsCount = await this.postsRepository.count();
    const usersCount = await this.usersRepository.count();

    if (usersCount === 0) {
      await this.seedUsers();
    }

    if (postsCount === 0) {
      await this.seedPosts();
    }
  }

  private async seedUsers() {
    const usersData = [
      {
        email: 'user1@example.com',
        password: 'password123',
        nickname: 'AnonimowyAutor1',
      },
      {
        email: 'user2@example.com',
        password: 'password123',
        nickname: 'AnonimowyAutor2',
      },
      {
        email: 'user3@example.com',
        password: 'password123',
        nickname: 'AnonimowyAutor3',
      },
      {
        email: 'user4@example.com',
        password: 'password123',
        nickname: 'AnonimowyAutor4',
      },
      {
        email: 'user5@example.com',
        password: 'password123',
        nickname: 'AnonimowyAutor5',
      },
    ];

    const createdUsers = [];
    for (const userData of usersData) {
      const user = this.usersRepository.create(userData);
      const savedUser = await this.usersRepository.save(user);
      createdUsers.push(savedUser);
    }

    console.log(
      'Baza danych została zainicjalizowana przykładowymi użytkownikami',
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return createdUsers;
  }

  private async seedPosts() {
    // Pobierz wszystkich użytkowników z bazy danych
    const users = await this.usersRepository.find();

    if (users.length === 0) {
      console.log(
        'Brak użytkowników w bazie danych. Najpierw uruchom seedUsers().',
      );
      return;
    }

    const seedData = [
      {
        authorId: users[0].id,
        title: 'Przypadkowe spotkanie',
        content:
          'Nigdy nie zapomnę, jak przypadkiem poznałem swojego najlepszego przyjaciela, gdy zgubiłem się w obcym mieście.',
        createdAt: new Date('2025-05-20T14:12:00Z'),
        tags: ['friendship', 'life', 'unexpected'],
        likes: 125,
        commentsCount: 8,
      },
      {
        authorId: users[1]?.id || users[0].id,
        title: 'Powrót z przeszłości',
        content:
          'Po latach milczenia napisała do mnie osoba, której bardzo brakowało mi w życiu.',
        createdAt: new Date('2025-05-19T09:47:00Z'),
        tags: ['life', 'nostalgia', 'relationships'],
        likes: 87,
        commentsCount: 5,
      },
      {
        authorId: users[2]?.id || users[0].id,
        title: 'Dobro wraca',
        content:
          "Zgubiłem portfel, ale ktoś go zwrócił z karteczką: 'Dobro wraca'.",
        createdAt: new Date('2025-05-18T18:30:00Z'),
        tags: ['kindness', 'everyday', 'hope'],
        likes: 200,
        commentsCount: 14,
      },
      {
        authorId: users[3]?.id || users[0].id,
        title: 'Wystarczająco dobry',
        content:
          'Zrozumiałem, że nie muszę być idealny, żeby być wystarczający.',
        createdAt: new Date('2025-05-17T21:05:00Z'),
        tags: ['mental_health', 'reflection', 'selflove'],
        likes: 173,
        commentsCount: 12,
      },
      {
        authorId: users[4]?.id || users[0].id,
        title: 'Ktoś, komu zależy',
        content:
          'Pierwszy raz od lat poczułem, że naprawdę komuś na mnie zależy.',
        createdAt: new Date('2025-05-16T16:50:00Z'),
        tags: ['emotions', 'support', 'healing'],
        likes: 149,
        commentsCount: 9,
      },
    ];

    for (const postData of seedData) {
      const post = this.postsRepository.create(postData);
      await this.postsRepository.save(post);
    }

    console.log('Baza danych została zainicjalizowana przykładowymi postami');
  }
}
