import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async findAll(tag?: string, authorId?: string): Promise<Post[]> {
    const query = this.postsRepository.createQueryBuilder('post');

    if (tag) {
      query.where('post.tags LIKE :tag', { tag: `%${tag}%` });
    }

    if (authorId) {
      query.andWhere('post.authorId = :authorId', { authorId });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post o ID ${id} nie został znaleziony`);
    }
    return post;
  }

  async findByAuthor(authorId: string): Promise<Post[]> {
    return this.postsRepository.find({ where: { authorId } });
  }

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const post = this.postsRepository.create({
      ...createPostDto,
      authorId: user.id,
    });
    return this.postsRepository.save(post);
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);

    // Sprawdzenie czy autorId się zgadza
    if (post.authorId !== updatePostDto.authorId) {
      throw new ForbiddenException('Nie masz uprawnień do edycji tego posta');
    }

    // Aktualizacja tylko podanych pól
    if (updatePostDto.title) {
      post.title = updatePostDto.title;
    }

    if (updatePostDto.content) {
      post.content = updatePostDto.content;
    }

    if (updatePostDto.tags) {
      post.tags = updatePostDto.tags;
    }

    return this.postsRepository.save(post);
  }

  async remove(id: string, authorId: string): Promise<void> {
    const post = await this.findOne(id);

    // Sprawdzenie czy autorId się zgadza
    if (post.authorId !== authorId) {
      throw new ForbiddenException(
        'Nie masz uprawnień do usunięcia tego posta',
      );
    }

    await this.postsRepository.remove(post);
  }
}
