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
import { SortOption } from './enum/sort-option.enum';
import { FeedCursor } from './dto/cursor.dto';
import { encodeCursor } from './dto/cursor.dto';
import { TagsService } from 'src/tags/tags.service';
@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly tagsService: TagsService,
  ) {}

  async findAll(
    tag?: string,
    authorId?: string,
    page: number = 1,
    limit: number = 10,
    userId?: string,
    sortBy?: SortOption,
  ): Promise<{ data: PostWithDetailsDto[]; meta: any }> {
    if (tag) {
      const tagEntity = await this.tagsService.findOneBySlug(tag);
      if (!tagEntity) {
        return {
          data: [],
          meta: {
            page,
            limit,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        };
      }
      tag = tagEntity.slug;
    }

    const result = await this.postRepository.findAllWithDetails(
      page,
      limit,
      userId,
      tag,
      authorId,
      sortBy,
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

  async findAllCursor(
    tag: string | undefined,
    authorId: string | undefined,
    limit: number = 10,
    userId?: string,
    sortBy?: SortOption,
    cursor?: { createdAt: string; id: string } | null,
  ): Promise<{ data: PostWithDetailsDto[]; nextCursor: string | null }> {
    const take = Math.min(Math.max(Number(limit) || 10, 1), 50);
    const { posts } = await this.postRepository.findAllWithDetailsCursor(
      take + 1,
      userId,
      tag,
      authorId,
      sortBy,
      cursor || null,
    );

    const hasMore = posts.length > take;
    const sliced = hasMore ? posts.slice(0, take) : posts;

    const last: PostWithDetailsDto | undefined = sliced[sliced.length - 1];
    if (!last) return { data: sliced, nextCursor: null };

    const createdAtISO =
      last.createdAt instanceof Date
        ? last.createdAt.toISOString()
        : new Date(String(last.createdAt)).toISOString();

    const payload: FeedCursor = {
      createdAt: createdAtISO,
      id: String(last.id),
      likesCount: Number(last.likesCount ?? 0),
      commentsCount: Number(last.commentsCount ?? 0),
    };

    const nextCursor = encodeCursor(payload);
    return { data: sliced, nextCursor };
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
    const slugs = (createPostDto.tags || [])
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    await this.tagsService.upsertManyBySlugs(slugs);
    const tags = await this.tagsService.findBySlugs(slugs);

    const post = this.postRepository.create({
      title: createPostDto.title,
      content: createPostDto.content,
      authorId: user.id,
      tags: tags,
    });

    const saved = await this.postRepository.save(post);
    if (slugs.length) await this.tagsService.incrementPostCount(slugs, 1);
    return saved;
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
      const prevSlugs = new Set((post.tags || []).map((t) => t.slug));
      const nextSlugs = new Set(
        updatePostDto.tags.map((s) => s.trim().toLowerCase()).filter(Boolean),
      );
      const added = Array.from(nextSlugs).filter((s) => !prevSlugs.has(s));
      const removed = Array.from(prevSlugs).filter((s) => !nextSlugs.has(s));

      await this.tagsService.upsertManyBySlugs(Array.from(nextSlugs));
      const nextTags = await this.tagsService.findBySlugs(
        Array.from(nextSlugs),
      );
      post.tags = nextTags;

      const saved = await this.postRepository.save(post);
      if (added.length) await this.tagsService.incrementPostCount(added, 1);
      if (removed.length)
        await this.tagsService.incrementPostCount(removed, -1);
      return saved;
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

    const slugs = (post.tags || []).map((t) => t.slug);
    await this.postRepository.remove(post);
    if (slugs.length) await this.tagsService.incrementPostCount(slugs, -1);
  }
}
