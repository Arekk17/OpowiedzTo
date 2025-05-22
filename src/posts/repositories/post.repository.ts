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
}
