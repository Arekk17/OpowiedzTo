import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';
import { Comment } from '../posts/entities/comment.entity';
import { PostLike } from '../posts/entities/post-like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Comment, PostLike])],
  providers: [SeedService],
})
export class SeedModule {}
