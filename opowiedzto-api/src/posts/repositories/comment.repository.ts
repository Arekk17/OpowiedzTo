import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CommentRepository extends Repository<Comment> {
  constructor(private dataSource: DataSource) {
    super(Comment, dataSource.createEntityManager());
  }

  async findByPost(postId: string, limit: number = 3): Promise<Comment[]> {
    return this.find({
      where: { postId },
      relations: ['author'],
      order: { createdAt: 'DESC' },
      take: limit && limit > 0 ? Math.min(limit, 10) : undefined,
    });
  }

  async findWithAuthor(id: string): Promise<Comment | null> {
    return this.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  async countComments(postId: string): Promise<number> {
    return this.count({
      where: { postId },
    });
  }
}
