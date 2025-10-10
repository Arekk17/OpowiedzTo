import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { Comment } from '../entities/comment.entity';
import { PostLike } from '../entities/post-like.entity';
import { PostWithDetailsDto } from '../dto/post-with-details.dto';
import { AuthorDto } from '../dto/author.dto';
import { SortOption } from '../enum/sort-option.enum';

@Injectable()
export class PostsRepository {
  private postRepo: Repository<Post>;
  private commentRepo: Repository<Comment>;
  private likeRepo: Repository<PostLike>;

  constructor(private dataSource: DataSource) {
    this.postRepo = this.dataSource.getRepository(Post);
    this.commentRepo = this.dataSource.getRepository(Comment);
    this.likeRepo = this.dataSource.getRepository(PostLike);
  }

  async findAllWithDetailsCursor(
    limit: number = 10,
    userId?: string,
    tag?: string,
    authorId?: string,
    sortBy?: SortOption,
    cursor?: { createdAt: string; id: string } | null,
  ): Promise<{ posts: PostWithDetailsDto[]; total: number }> {
    const queryBuilder = this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.tags', 't');

    if (tag) {
      queryBuilder
        .innerJoin('post.tags', 'tag')
        .andWhere('tag.slug = :tag', { tag });
    }

    if (authorId) {
      queryBuilder.andWhere('post.authorId = :authorId', { authorId });
    }

    if (userId) {
      queryBuilder
        .leftJoin('post.postLikes', 'userLike', 'userLike.userId = :userId', {
          userId,
        })
        .addSelect(
          'CASE WHEN userLike.id IS NOT NULL THEN true ELSE false END',
          'isLikedByUser',
        );
    }

    if (cursor && cursor.createdAt) {
      queryBuilder.andWhere(
        '(post.createdAt < :createdAt OR (post.createdAt = :createdAt AND post.id < :id))',
        { createdAt: new Date(cursor.createdAt), id: cursor.id },
      );
    }

    if (sortBy === SortOption.NEWEST) {
      queryBuilder.orderBy('post.createdAt', 'DESC');
    } else if (sortBy === SortOption.POPULAR) {
      queryBuilder.orderBy('post.likesCount', 'DESC');
    } else if (sortBy === SortOption.MOST_COMMENTED) {
      queryBuilder.orderBy('post.commentsCount', 'DESC');
    } else {
      queryBuilder.orderBy('post.createdAt', 'DESC');
    }

    const posts = await queryBuilder.take(limit).getMany();

    const postsWithDetails: PostWithDetailsDto[] = await Promise.all(
      posts.map(async (post) => {
        const likeCount = await this.likeRepo.count({
          where: { postId: post.id },
        });
        const commentCount = await this.commentRepo.count({
          where: { postId: post.id },
        });
        const isLikedByUser = userId
          ? (await this.likeRepo.findOne({
              where: { userId, postId: post.id },
            })) !== null
          : false;
        const author: AuthorDto = {
          id: post.author.id,
          email: post.author.email,
          nickname: post.author.nickname,
          gender: post.author.gender as unknown as string,
          createdAt: post.author.createdAt,
          updatedAt: post.author.updatedAt,
          avatar: post.author.avatar,
        };
        const lastCommentsRaw = await this.commentRepo.find({
          where: { postId: post.id },
          order: { createdAt: 'DESC' },
          take: 3,
          relations: ['author'],
        });
        const lastComments = lastCommentsRaw.map((comment) => ({
          id: comment.id,
          authorId: comment.authorId,
          content: comment.content,
          createdAt: comment.createdAt,
          author: {
            id: comment.author.id,
            email: comment.author.email,
            nickname: comment.author.nickname,
            gender: comment.author.gender as unknown as string,
            createdAt: comment.author.createdAt,
            updatedAt: comment.author.updatedAt,
            avatar: comment.author.avatar,
          },
        }));
        return {
          id: post.id,
          title: post.title,
          content: post.content,
          authorId: post.authorId,
          author,
          latestComments: lastComments,
          tags: post.tags,
          likesCount: likeCount,
          commentsCount: commentCount,
          isLiked: isLikedByUser,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
        };
      }),
    );

    return { posts: postsWithDetails, total: postsWithDetails.length };
  }

  async findAllWithDetailsSearch(
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
    userId?: string,
  ): Promise<{ posts: PostWithDetailsDto[]; total: number }> {
    const queryBuilder = this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.tags', 't')
      .andWhere('(post.title ILIKE :term OR post.content ILIKE :term)', {
        term: `%${searchTerm}%`,
      })
      .orderBy('post.createdAt', 'DESC');

    if (userId) {
      queryBuilder
        .leftJoin('post.postLikes', 'userLike', 'userLike.userId = :userId', {
          userId,
        })
        .addSelect(
          'CASE WHEN userLike.id IS NOT NULL THEN true ELSE false END',
          'isLikedByUser',
        );
    }

    const total = await queryBuilder.getCount();
    const skip = (page - 1) * limit;
    const posts = await queryBuilder.skip(skip).take(limit).getMany();

    const postsWithDetails: PostWithDetailsDto[] = await Promise.all(
      posts.map(async (post) => {
        const likeCount = await this.likeRepo.count({
          where: { postId: post.id },
        });
        const commentCount = await this.commentRepo.count({
          where: { postId: post.id },
        });
        const isLikedByUser = userId
          ? (await this.likeRepo.findOne({
              where: { userId, postId: post.id },
            })) !== null
          : false;
        const author: AuthorDto = {
          id: post.author.id,
          email: post.author.email,
          nickname: post.author.nickname,
          gender: post.author.gender as unknown as string,
          createdAt: post.author.createdAt,
          updatedAt: post.author.updatedAt,
          avatar: post.author.avatar,
        };
        const lastCommentsRaw = await this.commentRepo.find({
          where: { postId: post.id },
          order: { createdAt: 'DESC' },
          take: 3,
          relations: ['author'],
        });
        const lastComments = lastCommentsRaw.map((comment) => ({
          id: comment.id,
          authorId: comment.authorId,
          content: comment.content,
          createdAt: comment.createdAt,
          author: {
            id: comment.author.id,
            email: comment.author.email,
            nickname: comment.author.nickname,
            gender: comment.author.gender as unknown as string,
            createdAt: comment.author.createdAt,
            updatedAt: comment.author.updatedAt,
            avatar: comment.author.avatar,
          },
        }));
        return {
          id: post.id,
          title: post.title,
          content: post.content,
          authorId: post.authorId,
          author,
          tags: post.tags,
          likesCount: likeCount,
          commentsCount: commentCount,
          isLiked: isLikedByUser,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          latestComments: lastComments,
        };
      }),
    );

    return { posts: postsWithDetails, total };
  }

  async findOneWithDetails(
    id: string,
    userId?: string,
  ): Promise<PostWithDetailsDto | null> {
    const queryBuilder = this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.tags', 't')
      .where('post.id = :id', { id });

    if (userId) {
      queryBuilder
        .leftJoin('post.postLikes', 'userLike', 'userLike.userId = :userId', {
          userId,
        })
        .addSelect(
          'CASE WHEN userLike.id IS NOT NULL THEN true ELSE false END',
          'isLikedByUser',
        );
    }

    const post = await queryBuilder.getOne();

    if (!post) {
      return null;
    }

    const likeCount = await this.likeRepo.count({
      where: { postId: post.id },
    });

    const commentCount = await this.commentRepo.count({
      where: { postId: post.id },
    });

    const isLikedByUser = userId
      ? (await this.likeRepo.findOne({
          where: { userId, postId: post.id },
        })) !== null
      : false;

    const author: AuthorDto = {
      id: post.author.id,
      email: post.author.email,
      nickname: post.author.nickname,
      gender: post.author.gender as unknown as string,
      createdAt: post.author.createdAt,
      updatedAt: post.author.updatedAt,
      avatar: post.author.avatar,
    };

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      author,
      tags: post.tags,
      likesCount: likeCount,
      commentsCount: commentCount,
      isLiked: isLikedByUser,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      latestComments: [],
    };
  }

  async findEntityById(id: string): Promise<Post | null> {
    return this.postRepo.findOne({
      where: { id },
      relations: ['author', 'tags'],
    });
  }

  async findEntitiesByAuthor(authorId: string): Promise<Post[]> {
    return this.postRepo.find({
      where: { authorId },
      relations: ['author', 'tags'],
    });
  }

  async create(postData: Partial<Post>): Promise<Post> {
    const post = this.postRepo.create(postData);
    return this.postRepo.save(post);
  }

  async update(id: string, updateData: Partial<Post>): Promise<Post | null> {
    await this.postRepo.update(id, updateData);
    return this.postRepo.findOne({
      where: { id },
      relations: ['author', 'tags'],
    });
  }

  async delete(id: string): Promise<void> {
    await this.postRepo.delete(id);
  }

  async findCommentsByPost(postId: string): Promise<Comment[]> {
    return this.commentRepo.find({
      where: { postId },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findCommentWithAuthor(id: string): Promise<Comment | null> {
    return this.commentRepo.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  async countComments(postId: string): Promise<number> {
    return this.commentRepo.count({
      where: { postId },
    });
  }

  async createComment(commentData: Partial<Comment>): Promise<Comment> {
    const comment = this.commentRepo.create(commentData);
    return this.commentRepo.save(comment);
  }

  async updateComment(
    id: string,
    updateData: Partial<Comment>,
  ): Promise<Comment | null> {
    await this.commentRepo.update(id, updateData);
    return this.commentRepo.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  async deleteComment(id: string): Promise<void> {
    await this.commentRepo.delete(id);
  }

  async findLikeByUserAndPost(
    userId: string,
    postId: string,
  ): Promise<PostLike | null> {
    return this.likeRepo.findOne({
      where: { userId, postId },
    });
  }

  async findLikesWithUsers(postId: string): Promise<PostLike[]> {
    return this.likeRepo.find({
      where: { postId },
      relations: ['user'],
    });
  }

  async countLikes(postId: string): Promise<number> {
    return this.likeRepo.count({
      where: { postId },
    });
  }

  async createLike(likeData: Partial<PostLike>): Promise<PostLike> {
    const like = this.likeRepo.create(likeData);
    return this.likeRepo.save(like);
  }

  async deleteLike(id: string): Promise<void> {
    await this.likeRepo.delete(id);
  }
}
