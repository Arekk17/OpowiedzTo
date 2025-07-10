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
import { Comment } from '../../posts/entities/comment.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ReportCategory } from '../enums/report-category.enum';

@Entity('comment_reports')
@Unique(['commentId', 'reporterId'])
export class CommentReport {
  @ApiProperty({ example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'uuid-v4' })
  @Column()
  commentId: string;

  @ApiProperty({ example: 'uuid-v4' })
  @Column()
  reporterId: string;

  @ApiProperty({ enum: ReportCategory, example: ReportCategory.OFFENSIVE })
  @Column({
    type: 'enum',
    enum: ReportCategory,
  })
  category: ReportCategory;

  @ApiProperty({ example: 'Komentarz zawiera obraźliwe treści' })
  @Column('text')
  reason: string;

  @ApiProperty({ example: '2024-01-01T12:00:00Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reporterId' })
  reporter: User;

  @ManyToOne(() => Comment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'commentId' })
  comment: Comment;
}
