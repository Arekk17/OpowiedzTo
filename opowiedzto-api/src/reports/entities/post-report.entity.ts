import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ReportCategory } from '../enums/report-category.enum';

@Entity('post_reports')
@Unique(['postId', 'reporterId'])
export class PostReport {
  @ApiProperty({ example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'uuid-v4' })
  @Column()
  postId: string;

  @ApiProperty({ example: 'uuid-v4' })
  @Column()
  reporterId: string;

  @ApiProperty({ enum: ReportCategory, example: ReportCategory.OFFENSIVE })
  @Column({
    type: 'enum',
    enum: ReportCategory,
  })
  category: ReportCategory;

  @ApiProperty({ example: 'Post zawiera obraźliwe treści' })
  @Column('text')
  reason: string;

  @ApiProperty({ example: '2024-01-01T12:00:00Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reporterId' })
  reporter: User;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;
}
