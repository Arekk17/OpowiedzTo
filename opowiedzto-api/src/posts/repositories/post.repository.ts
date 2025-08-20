import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(private dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }

  async findByTag(tag: string): Promise<Post[]> {
    return this.createQueryBuilder('post')
      .where('post.tags LIKE :tag', { tag: `%${tag}%` })
      .getMany();
  }

  async findByAuthor(authorId: string): Promise<Post[]> {
    return this.find({
      where: { authorId },
      order: { createdAt: 'DESC' },
    });
  }

  async findWithAuthor(id: string): Promise<Post | null> {
    return this.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  async findAllWithAuthors(): Promise<Post[]> {
    return this.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByTagWithAuthor(tag: string): Promise<Post[]> {
    return this.createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .where('post.tags LIKE :tag', { tag: `%${tag}%` })
      .orderBy('post.createdAt', 'DESC')
      .getMany();
  }

  async findAllWithPagination(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ posts: Post[]; total: number }> {
    const skip = (page - 1) * limit;

    const [posts, total] = await this.createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { posts, total };
  }

  async findByTagWithPagination(
    tag: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ posts: Post[]; total: number }> {
    const skip = (page - 1) * limit;

    const [posts, total] = await this.createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .where('post.tags LIKE :tag', { tag: `%${tag}%` })
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { posts, total };
  }

  async findByAuthorWithPagination(
    authorId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ posts: Post[]; total: number }> {
    const skip = (page - 1) * limit;

    const [posts, total] = await this.createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .where('post.authorId = :authorId', { authorId })
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { posts, total };
  }

  async searchWithPagination(
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ posts: Post[]; total: number }> {
    const skip = (page - 1) * limit;

    const [posts, total] = await this.createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .where(
        'post.title ILIKE :searchTerm OR post.content ILIKE :searchTerm OR post.tags::text ILIKE :searchTerm',
        { searchTerm: `%${searchTerm}%` },
      )
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { posts, total };
  }
}
