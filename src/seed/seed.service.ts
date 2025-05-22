import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../posts/entities/post.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async onApplicationBootstrap() {
    const postsCount = await this.postsRepository.count();

    // Wypełnij bazę danych tylko jeśli jest pusta
    if (postsCount === 0) {
      await this.seedPosts();
    }
  }

  private async seedPosts() {
    const seedData = [
      {
        id: '101',
        authorId: '1',
        title: 'Przypadkowe spotkanie',
        content:
          'Nigdy nie zapomnę, jak przypadkiem poznałem swojego najlepszego przyjaciela, gdy zgubiłem się w obcym mieście.',
        createdAt: new Date('2025-05-20T14:12:00Z'),
        tags: ['friendship', 'life', 'unexpected'],
        likes: 125,
        commentsCount: 8,
      },
      {
        id: '102',
        authorId: '2',
        title: 'Powrót z przeszłości',
        content:
          'Po latach milczenia napisała do mnie osoba, której bardzo brakowało mi w życiu.',
        createdAt: new Date('2025-05-19T09:47:00Z'),
        tags: ['life', 'nostalgia', 'relationships'],
        likes: 87,
        commentsCount: 5,
      },
      {
        id: '103',
        authorId: '3',
        title: 'Dobro wraca',
        content:
          "Zgubiłem portfel, ale ktoś go zwrócił z karteczką: 'Dobro wraca'.",
        createdAt: new Date('2025-05-18T18:30:00Z'),
        tags: ['kindness', 'everyday', 'hope'],
        likes: 200,
        commentsCount: 14,
      },
      {
        id: '104',
        authorId: '4',
        title: 'Wystarczająco dobry',
        content:
          'Zrozumiałem, że nie muszę być idealny, żeby być wystarczający.',
        createdAt: new Date('2025-05-17T21:05:00Z'),
        tags: ['mental_health', 'reflection', 'selflove'],
        likes: 173,
        commentsCount: 12,
      },
      {
        id: '105',
        authorId: '5',
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
