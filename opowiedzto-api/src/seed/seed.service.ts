import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';
import { Comment } from '../posts/entities/comment.entity';
import { PostLike } from '../posts/entities/post-like.entity';
import { TagsService } from '../tags/tags.service';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(PostLike)
    private postLikesRepository: Repository<PostLike>,
    private readonly tagsService: TagsService,
  ) {}

  async onApplicationBootstrap() {
    const postsCount = await this.postsRepository.count();
    const usersCount = await this.usersRepository.count();

    if (usersCount === 0) {
      await this.seedUsers();
    }

    if (postsCount === 0) {
      await this.seedPosts();
      await this.seedLikes();
      await this.seedComments();
    }
  }

  private async seedUsers(): Promise<User[]> {
    const usersData: Array<{
      email: string;
      password: string;
      nickname: string;
    }> = [];

    // Tworzymy 20 użytkowników
    for (let i = 1; i <= 20; i++) {
      usersData.push({
        email: `user${i}@example.com`,
        password: 'password123',
        nickname: `AnonimowyAutor${i}`,
      });
    }

    const createdUsers: User[] = [];
    for (const userData of usersData) {
      const user = this.usersRepository.create(userData);
      const savedUser = await this.usersRepository.save(user);
      createdUsers.push(savedUser);
    }

    return createdUsers;
  }

  private async seedPosts(): Promise<Post[]> {
    const users = await this.usersRepository.find();

    if (users.length === 0) {
      return [];
    }

    const postTemplates = [
      {
        title: 'Przypadkowe spotkanie',
        content:
          'Nigdy nie zapomnę, jak przypadkiem poznałem swojego najlepszego przyjaciela, gdy zgubiłem się w obcym mieście.',
        tags: ['przyjaźń', 'życie', 'przypadek'],
      },
      {
        title: 'Powrót z przeszłości',
        content:
          'Po latach milczenia napisała do mnie osoba, której bardzo brakowało mi w życiu.',
        tags: ['życie', 'nostalgia', 'relacje'],
      },
      {
        title: 'Dobro wraca',
        content:
          "Zgubiłem portfel, ale ktoś go zwrócił z karteczką: 'Dobro wraca'.",
        tags: ['życzliwość', 'codzienność', 'nadzieja'],
      },
      {
        title: 'Wystarczająco dobry',
        content:
          'Zrozumiałem, że nie muszę być idealny, żeby być wystarczający.',
        tags: ['psychika', 'refleksja', 'miłość-do-siebie'],
      },
      {
        title: 'Ktoś, komu zależy',
        content:
          'Pierwszy raz od lat poczułem, że naprawdę komuś na mnie zależy.',
        tags: ['emocje', 'wsparcie', 'uzdrawianie'],
      },
      {
        title: 'Nowy początek',
        content:
          'Dziś postanowiłem zmienić swoje życie. Małe kroki, ale w dobrym kierunku.',
        tags: ['zmiana', 'motywacja', 'przyszłość'],
      },
      {
        title: 'Rodzinna historia',
        content:
          'Babcia opowiedziała mi historię, która zmieniła moje spojrzenie na życie.',
        tags: ['rodzina', 'mądrość', 'tradycja'],
      },
      {
        title: 'Przeprosiny',
        content:
          'Po latach znalazłem odwagę, żeby przeprosić osobę, którą skrzywdziłem.',
        tags: ['przebaczenie', 'odwaga', 'relacje'],
      },
      {
        title: 'Pierwszy dzień',
        content:
          'Dziś był mój pierwszy dzień w nowej pracy. Wszystko poszło lepiej niż myślałem.',
        tags: ['praca', 'nowe-doświadczenie', 'sukces'],
      },
      {
        title: 'Stare zdjęcie',
        content:
          'Znalazłem stare zdjęcie i przypomniałem sobie, jak piękne było dzieciństwo.',
        tags: ['wspomnienia', 'dzieciństwo', 'nostalgia'],
      },
    ];

    const createdPosts: Post[] = [];

    // Tworzymy 40 postów
    for (let i = 0; i < 40; i++) {
      const template = postTemplates[i % postTemplates.length];
      const randomUser = users[Math.floor(Math.random() * users.length)];

      // Losowa data z ostatnich 30 dni
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
      randomDate.setHours(Math.floor(Math.random() * 24));
      randomDate.setMinutes(Math.floor(Math.random() * 60));

      // Tworzymy/znajdujemy tagi
      const tagSlugs = template.tags.map((tag) => tag.toLowerCase().trim());
      await this.tagsService.upsertManyBySlugs(tagSlugs);
      const tags = await this.tagsService.findBySlugs(tagSlugs);

      const post = this.postsRepository.create({
        authorId: randomUser.id,
        title: `${template.title} ${i + 1}`,
        content: template.content,
        tags: tags,
        createdAt: randomDate,
        likesCount: 0, // Będzie aktualizowane przez seedLikes
        commentsCount: 0,
      });

      const savedPost = await this.postsRepository.save(post);
      createdPosts.push(savedPost);

      // Aktualizuj licznik postów dla tagów
      if (tagSlugs.length > 0) {
        await this.tagsService.incrementPostCount(tagSlugs, 1);
      }
    }

    return createdPosts;
  }

  // ... reszta metod pozostaje bez zmian
  private async seedLikes() {
    const users = await this.usersRepository.find();
    const posts = await this.postsRepository.find();

    if (users.length === 0 || posts.length === 0) {
      return;
    }

    // Każdy post może mieć od 0 do 50 polubień
    for (const post of posts) {
      const likesCount = Math.floor(Math.random() * 51); // 0-50 polubień

      // Losowi użytkownicy, którzy polubili ten post
      const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
      const usersWhoLiked = shuffledUsers.slice(0, likesCount);

      for (const user of usersWhoLiked) {
        // Sprawdź czy użytkownik już polubił ten post
        const existingLike = await this.postLikesRepository.findOne({
          where: { userId: user.id, postId: post.id },
        });

        if (!existingLike) {
          const like = this.postLikesRepository.create({
            userId: user.id,
            postId: post.id,
          });
          await this.postLikesRepository.save(like);
        }
      }

      // Aktualizuj licznik polubień w poście
      await this.postsRepository.update(post.id, { likesCount });
    }
  }

  private async seedComments() {
    const users = await this.usersRepository.find();
    const posts = await this.postsRepository.find();

    if (users.length === 0 || posts.length === 0) {
      return;
    }

    const commentTemplates = [
      'Świetny post! Dzięki za podzielenie się.',
      'To bardzo inspirujące. Dziękuję!',
      'Mam podobne doświadczenia. Trzymaj się!',
      'Pięknie napisane. Wzruszyło mnie to.',
      'Dzięki za te słowa. Bardzo mi pomogły.',
      'Czuję to samo. Nie jesteś sam.',
      'Wspaniała historia! Życzę wszystkiego najlepszego.',
      'To prawda. Czasami małe rzeczy znaczą najwięcej.',
      'Dziękuję za podzielenie się tym doświadczeniem.',
      'Bardzo mądre słowa. Zapamiętam to.',
      'Masz rację. Dobro zawsze wraca.',
      'To piękne. Dzięki za inspirację.',
      'Czuję się tak samo. Trzymajmy się razem.',
      'Świetna historia! Życzę powodzenia.',
      'Dzięki za te słowa. Bardzo mi pomogły.',
    ];

    // Każdy post może mieć od 0 do 15 komentarzy
    for (const post of posts) {
      const commentsCount = Math.floor(Math.random() * 16); // 0-15 komentarzy

      for (let i = 0; i < commentsCount; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomComment =
          commentTemplates[Math.floor(Math.random() * commentTemplates.length)];

        // Losowa data komentarza (po dacie posta)
        const commentDate = new Date(post.createdAt);
        commentDate.setDate(
          commentDate.getDate() + Math.floor(Math.random() * 7),
        ); // Do 7 dni po poście

        const comment = this.commentsRepository.create({
          postId: post.id,
          authorId: randomUser.id,
          content: randomComment,
          createdAt: commentDate,
        });

        await this.commentsRepository.save(comment);
      }

      // Aktualizuj licznik komentarzy w poście
      await this.postsRepository.update(post.id, { commentsCount });
    }
  }
}
