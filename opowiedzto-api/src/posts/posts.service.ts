import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';
import { PostsRepository } from './repositories/posts.repository';
import { PostWithDetailsDto } from './dto/post-with-details.dto';
import { SortOption } from './enum/sort-option.enum';
import { FeedCursor } from './dto/cursor.dto';
import { encodeCursor } from './dto/cursor.dto';
import { TagsService } from 'src/tags/tags.service';
import { PostLike } from './entities/post-like.entity';
@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly tagsService: TagsService,
  ) {}

  async findAllCursor(
    tag: string | undefined,
    authorId: string | undefined,
    limit: number = 10,
    userId?: string,
    sortBy?: SortOption,
    cursor?: { createdAt: string; id: string } | null,
  ): Promise<{
    data: PostWithDetailsDto[];
    nextCursor: string | null;
    meta: { total: number };
  }> {
    const take = Math.min(Math.max(Number(limit) || 10, 1), 50);
    const { posts, total } =
      await this.postsRepository.findAllWithDetailsCursor(
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
    if (!last) return { data: sliced, nextCursor: null, meta: { total } };

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
    return { data: sliced, nextCursor, meta: { total } };
  }

  async findOneWithDetails(
    id: string,
    userId?: string,
  ): Promise<PostWithDetailsDto> {
    const post = await this.postsRepository.findOneWithDetails(id, userId);
    if (!post) {
      throw new NotFoundException(`Post o ID ${id} nie został znaleziony`);
    }
    return post;
  }

  async findByAuthor(authorId: string): Promise<Post[]> {
    return this.postsRepository.findEntitiesByAuthor(authorId);
  }

  async search(
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
    userId?: string,
  ): Promise<{ data: PostWithDetailsDto[]; meta: any }> {
    const result = await this.postsRepository.findAllWithDetailsSearch(
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

    const post = await this.postsRepository.create({
      title: createPostDto.title,
      content: createPostDto.content,
      authorId: user.id,
      tags: tags,
    });

    if (slugs.length) await this.tagsService.incrementPostCount(slugs, 1);
    return post;
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    user: User,
  ): Promise<Post> {
    const post = await this.postsRepository.findEntityById(id);

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
      const saved = await this.postsRepository.update(id, post);
      if (added.length) await this.tagsService.incrementPostCount(added, 1);
      if (removed.length)
        await this.tagsService.incrementPostCount(removed, -1);
      return saved;
    }

    return this.postsRepository.update(id, post);
  }

  async remove(id: string, userId: string): Promise<void> {
    const post = await this.postsRepository.findEntityById(id);

    if (post.authorId !== userId) {
      throw new ForbiddenException(
        'Nie masz uprawnień do usunięcia tego posta',
      );
    }

    const slugs = (post.tags || []).map((t) => t.slug);
    await this.postsRepository.delete(id);
    if (slugs.length) await this.tagsService.incrementPostCount(slugs, -1);
  }

  // Delegated like operations (moved from PostLikeService)
  async likePost(userId: string, postId: string): Promise<PostLike> {
    const post = await this.postsRepository.findOneWithDetails(postId);
    if (!post) {
      throw new NotFoundException('Post nie istnieje');
    }

    const existingLike = await this.postsRepository.findLikeByUserAndPost(
      userId,
      postId,
    );
    if (existingLike) {
      throw new BadRequestException('Już polubiłeś ten post');
    }

    const like = await this.postsRepository.createLike({ userId, postId });
    await this.postsRepository.incrementLikesCount(postId, 1);
    return like;
  }

  async unlikePost(userId: string, postId: string): Promise<void> {
    const like = await this.postsRepository.findLikeByUserAndPost(
      userId,
      postId,
    );
    if (!like) {
      throw new NotFoundException('Nie polubiłeś tego posta');
    }
    await this.postsRepository.deleteLike(like.id);
    await this.postsRepository.incrementLikesCount(postId, -1);
  }

  async getLikes(postId: string): Promise<User[]> {
    const likes = await this.postsRepository.findLikesWithUsers(postId);
    return likes.map((like) => like.user);
  }

  async getLikeCount(postId: string): Promise<number> {
    return this.postsRepository.countLikes(postId);
  }
}
