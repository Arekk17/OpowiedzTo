import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';
import { PostRepository } from './repositories/post.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postRepository: PostRepository) {}

  async findAll(tag?: string, authorId?: string): Promise<Post[]> {
    if (tag) {
      return this.postRepository.findByTagWithAuthor(tag);
    }
    if (authorId) {
      return this.postRepository.findByAuthor(authorId);
    }
    return this.postRepository.findAllWithAuthors();
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findWithAuthor(id);
    if (!post) {
      throw new NotFoundException(`Post o ID ${id} nie został znaleziony`);
    }
    return post;
  }

  async findByAuthor(authorId: string): Promise<Post[]> {
    return this.postRepository.findByAuthor(authorId);
  }

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const post = this.postRepository.create({
      ...createPostDto,
      authorId: user.id,
    });
    return this.postRepository.save(post);
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

    return this.postRepository.save(post);
  }

  async remove(id: string, authorId: string): Promise<void> {
    const post = await this.findOne(id);

    // Sprawdzenie czy autorId się zgadza
    if (post.authorId !== authorId) {
      throw new ForbiddenException(
        'Nie masz uprawnień do usunięcia tego posta',
      );
    }

    await this.postRepository.remove(post);
  }
}
