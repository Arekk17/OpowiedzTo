import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  authorId: string;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('simple-array')
  tags: string[];

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  commentsCount: number;
}
