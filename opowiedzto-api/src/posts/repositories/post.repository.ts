import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { PostWithDetailsDto } from '../dto/post-with-details.dto';
import { AuthorDto } from '../dto/author.dto';
import { TrendingTagDto } from '../dto/trending-tag.dto';
import { SortOption } from '../enum/sort-option.enum';
import { FeedCursor } from '../dto/cursor.dto';

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(private dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }

  async findAllWithDetails(
    page: number = 1,
    limit: number = 10,
    userId?: string,
    tag?: string,
    authorId?: string,
    sortBy?: SortOption,
  ): Promise<{ posts: PostWithDetailsDto[]; total: number }> {
    console.log(
      `PostRepository.findAllWithDetails: userId=${userId || 'null'}, page=${page}, limit=${limit}, sortBy=${sortBy}`,
    );
    const skip = (page - 1) * limit;

    const queryBuilder = this.createQueryBuilder('post').leftJoinAndSelect(
      'post.author',
      'author',
    );

    // Filtry
    if (tag) {
      queryBuilder.andWhere('post.tags LIKE :tag', { tag: `%${tag}%` });
    }

    if (authorId) {
      queryBuilder.andWhere('post.authorId = :authorId', { authorId });
    }

    // Sortowanie - używaj kolumn z encji
    switch (sortBy) {
      case SortOption.NEWEST:
        queryBuilder.orderBy('post.createdAt', 'DESC');
        break;
      case SortOption.POPULAR:
        queryBuilder.orderBy('post.likesCount', 'DESC');
        break;
      case SortOption.MOST_COMMENTED:
        queryBuilder.orderBy('post.commentsCount', 'DESC');
        break;
      default:
        queryBuilder.orderBy('post.createdAt', 'DESC');
        break;
    }

    const total = await queryBuilder.getCount();

    const posts = await queryBuilder.skip(skip).take(limit).getMany();

    if (posts.length === 0) {
      return { posts: [], total };
    }

    const postIds = posts.map((post) => post.id);

    let userLikedPostIds = new Set<string>();
    if (userId) {
      const userLikes = await this.dataSource
        .createQueryBuilder()
        .select('pl.postId', 'postId')
        .from('post_likes', 'pl')
        .where('pl.postId IN (:...postIds)', { postIds })
        .andWhere('pl.userId = :userId', { userId })
        .getRawMany();

      userLikedPostIds = new Set(
        userLikes.map((like: { postId: string }) => like.postId),
      );
    }

    const postsWithDetails: PostWithDetailsDto[] = posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      tags: post.tags,
      authorId: post.authorId,
      author: {
        id: post.author.id,
        email: post.author.email,
        nickname: post.author.nickname,
        gender: post.author.gender,
        createdAt: post.author.createdAt,
        updatedAt: post.author.updatedAt,
        avatar: post.author.avatar,
      } as AuthorDto,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      commentsCount: post.commentsCount,
      likesCount: post.likesCount,
      isLiked: userLikedPostIds.has(post.id),
    }));

    return { posts: postsWithDetails, total };
  }

  async findAllWithDetailsCursor(
    limit: number = 10,
    userId?: string,
    tag?: string,
    authorId?: string,
    sortBy?: SortOption,
    cursor?: FeedCursor | null,
  ): Promise<{ posts: PostWithDetailsDto[] }> {
    const qb = this.createQueryBuilder('post').leftJoinAndSelect(
      'post.author',
      'author',
    );

    if (tag) qb.andWhere('post.tags LIKE :tag', { tag: `%${tag}%` });
    if (authorId) qb.andWhere('post.authorId = :authorId', { authorId });

    // Sort + keyset predicate
    switch (sortBy) {
      case SortOption.POPULAR:
        qb.orderBy('post.likesCount', 'DESC')
          .addOrderBy('post.createdAt', 'DESC')
          .addOrderBy('post.id', 'DESC');
        if (cursor) {
          qb.andWhere(
            '(post.likesCount < :lc) OR (post.likesCount = :lc AND (post.createdAt < :cAt OR (post.createdAt = :cAt AND post.id < :cId)))',
            {
              lc: cursor.likesCount ?? 0,
              cAt: new Date(cursor.createdAt),
              cId: cursor.id,
            },
          );
        }
        break;
      case SortOption.MOST_COMMENTED:
        qb.orderBy('post.commentsCount', 'DESC')
          .addOrderBy('post.createdAt', 'DESC')
          .addOrderBy('post.id', 'DESC');
        if (cursor) {
          qb.andWhere(
            '(post.commentsCount < :cc) OR (post.commentsCount = :cc AND (post.createdAt < :cAt OR (post.createdAt = :cAt AND post.id < :cId)))',
            {
              cc: cursor.commentsCount ?? 0,
              cAt: new Date(cursor.createdAt),
              cId: cursor.id,
            },
          );
        }
        break;
      default: // NEWEST
        qb.orderBy('post.createdAt', 'DESC').addOrderBy('post.id', 'DESC');
        if (cursor) {
          qb.andWhere(
            '(post.createdAt < :cAt OR (post.createdAt = :cAt AND post.id < :cId))',
            { cAt: new Date(cursor.createdAt), cId: cursor.id },
          );
        }
        break;
    }

    qb.limit(limit);

    const entities = await qb.getMany();

    const postIds = entities.map((p) => p.id);
    let userLikedPostIds = new Set<string>();
    if (userId && postIds.length) {
      const userLikes = await this.dataSource
        .createQueryBuilder()
        .select('pl.postId', 'postId')
        .from('post_likes', 'pl')
        .where('pl.postId IN (:...postIds)', { postIds })
        .andWhere('pl.userId = :userId', { userId })
        .getRawMany();
      userLikedPostIds = new Set(
        userLikes.map((x: { postId: string }) => x.postId),
      );
    }

    const posts: PostWithDetailsDto[] = entities.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      tags: post.tags,
      authorId: post.authorId,
      author: {
        id: post.author.id,
        email: post.author.email,
        nickname: post.author.nickname,
        gender: post.author.gender,
        createdAt: post.author.createdAt,
        updatedAt: post.author.updatedAt,
        avatar: post.author.avatar,
      },
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      commentsCount: post.commentsCount,
      likesCount: post.likesCount,
      isLiked: userLikedPostIds.has(post.id),
    }));

    return { posts };
  }

  async searchWithDetails(
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
    userId?: string,
  ): Promise<{ posts: PostWithDetailsDto[]; total: number }> {
    const skip = (page - 1) * limit;

    const queryBuilder = this.createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(c.id)')
          .from('comment', 'c')
          .where('c.postId = post.id');
      }, 'commentsCount')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(pl.id)')
          .from('post_like', 'pl')
          .where('pl.postId = post.id');
      }, 'likesCount')
      .where(
        'post.title ILIKE :searchTerm OR post.content ILIKE :searchTerm OR post.tags::text ILIKE :searchTerm',
        { searchTerm: `%${searchTerm}%` },
      )
      .orderBy('post.createdAt', 'DESC');

    const total = await queryBuilder.getCount();

    const rawResult = await queryBuilder
      .skip(skip)
      .take(limit)
      .getRawAndEntities();

    if (rawResult.entities.length === 0) {
      return { posts: [], total };
    }

    const postIds = rawResult.entities.map((post) => post.id);

    let userLikedPostIds = new Set<string>();
    if (userId) {
      const userLikes = await this.dataSource
        .createQueryBuilder()
        .select('pl.postId', 'postId')
        .from('post_like', 'pl')
        .where('pl.postId IN (:...postIds)', { postIds })
        .andWhere('pl.userId = :userId', { userId })
        .getRawMany();

      userLikedPostIds = new Set(
        userLikes.map((like: { postId: string }) => like.postId),
      );
    }

    const postsWithDetails: PostWithDetailsDto[] = rawResult.entities.map(
      (post, index) => {
        const rawData = rawResult.raw[index] as {
          commentsCount: string;
          likesCount: string;
        };

        return {
          id: post.id,
          title: post.title,
          content: post.content,
          tags: post.tags,
          authorId: post.authorId,
          author: {
            id: post.author.id,
            email: post.author.email,
            nickname: post.author.nickname,
            gender: post.author.gender,
            createdAt: post.author.createdAt,
            updatedAt: post.author.updatedAt,
            avatar: post.author.avatar,
          } as AuthorDto,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          commentsCount: parseInt(rawData.commentsCount || '0'),
          likesCount: parseInt(rawData.likesCount || '0'),
          isLiked: userLikedPostIds.has(post.id),
        };
      },
    );

    return { posts: postsWithDetails, total };
  }

  async findWithAuthor(id: string): Promise<Post | null> {
    return this.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  async findByAuthor(authorId: string): Promise<Post[]> {
    return this.find({
      where: { authorId },
      order: { createdAt: 'DESC' },
    });
  }
  async getTrendingTags(limit: number = 6): Promise<TrendingTagDto[]> {
    const qb = this.dataSource
      .createQueryBuilder()
      .select('t.tag', 'tag')
      .addSelect('COUNT(*)', 'count')
      .from((sub) => {
        return sub
          .select("UNNEST(string_to_array(post.tags, ','))", 'tag')
          .from(Post, 'post');
      }, 't')
      .groupBy('t.tag')
      .orderBy('count', 'DESC')
      .limit(limit);

    const rows = await qb.getRawMany<{ tag: string; count: string }>();
    return rows
      .filter((r) => r.tag && r.tag.trim() !== '')
      .map((r) => ({ tag: r.tag.trim(), count: parseInt(r.count, 10) }));
  }
}
