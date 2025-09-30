import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Comment } from './comment.entity';
import { PostLike } from './post-like.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Tag } from 'src/tags/entities/tag.entity';

@Entity('posts')
export class Post {
  @ApiProperty({ example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'uuid-v4' })
  @Column()
  authorId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @ApiProperty({ example: 'Tytuł posta' })
  @Column()
  title: string;

  @ApiProperty({ example: 'Treść posta...' })
  @Column()
  content: string;

  @ApiProperty({ example: '2024-01-01T12:00:00Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T12:00:00Z' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ example: ['tag1', 'tag2'] })
  @ManyToMany(() => Tag, (tag) => tag.posts, { cascade: false })
  @JoinTable({
    name: 'post_tags',
    joinColumn: { name: 'postId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @ApiProperty({ example: 0 })
  @Column({ default: 0 })
  commentsCount: number;

  @ApiProperty({ example: 0 })
  @Column({ default: 0 })
  likesCount: number;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => PostLike, (like) => like.post)
  postLikes: PostLike[];
}
