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
import { PostWithDetailsDto } from './dto/post-with-details.dto';
import { TrendingTagDto } from './dto/trending-tag.dto';

@Injectable()
export class PostsService {
  constructor(private readonly postRepository: PostRepository) {}

  async findAll(
    tag?: string,
    authorId?: string,
    page: number = 1,
    limit: number = 10,
    userId?: string,
  ): Promise<{ data: PostWithDetailsDto[]; meta: any }> {
    const result = await this.postRepository.findAllWithDetails(
      page,
      limit,
      userId,
      tag,
      authorId,
    );

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

  async search(
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
    userId?: string,
  ): Promise<{ data: PostWithDetailsDto[]; meta: any }> {
    const result = await this.postRepository.searchWithDetails(
      searchTerm,
      page,
      limit,
      userId,
    );

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
        searchTerm,
      },
    };
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

  async remove(id: string, userId: string): Promise<void> {
    const post = await this.findOne(id);

    if (post.authorId !== userId) {
      throw new ForbiddenException(
        'Nie masz uprawnień do usunięcia tego posta',
      );
    }

    await this.postRepository.remove(post);
  }
  async getTrendingTags(limit: number = 6): Promise<TrendingTagDto[]> {
    return this.postRepository.getTrendingTags(limit);
  }
}
