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

  async findAll(
    tag?: string,
    authorId?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Post[]; meta: any }> {
    let result: { posts: Post[]; total: number };

    if (tag) {
      result = await this.postRepository.findByTagWithPagination(
        tag,
        page,
        limit,
      );
    } else if (authorId) {
      result = await this.postRepository.findByAuthorWithPagination(
        authorId,
        page,
        limit,
      );
    } else {
      result = await this.postRepository.findAllWithPagination(page, limit);
    }

    const totalPages = Math.ceil(result.total / limit);

    return {
      data: result.posts,
      meta: {
        page,
        limit,
        total: result.total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
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

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    user: User,
  ): Promise<Post> {
    const post = await this.findOne(id);

    if (post.authorId !== user.id) {
      throw new ForbiddenException('Nie masz uprawnień do edycji tego posta');
    }

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

    if (post.authorId !== authorId) {
      throw new ForbiddenException(
        'Nie masz uprawnień do usunięcia tego posta',
      );
    }

    await this.postRepository.remove(post);
  }

  async search(
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Post[]; meta: any }> {
    const result = await this.postRepository.searchWithPagination(
      searchTerm,
      page,
      limit,
    );
    const totalPages = Math.ceil(result.total / limit);

    const response: { data: Post[]; meta: any } = {
      data: result.posts,
      meta: {
        page,
        limit,
        total: result.total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        searchTerm,
      },
    };

    return response;
  }
}
