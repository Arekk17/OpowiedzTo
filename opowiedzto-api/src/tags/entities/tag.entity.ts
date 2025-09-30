import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';

@Entity('tags')
@Index('UQ_tags_slug', ['slug'], { unique: true })
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', length: 64 })
  name!: string;
  @Column({ type: 'varchar', length: 64 })
  slug!: string;
  @Column({ type: 'int', default: 0 })
  postCount: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];
}
