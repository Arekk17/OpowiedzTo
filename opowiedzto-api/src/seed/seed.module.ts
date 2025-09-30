import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';
import { Comment } from '../posts/entities/comment.entity';
import { PostLike } from '../posts/entities/post-like.entity';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, Comment, PostLike]),
    TagsModule,
  ],
  providers: [SeedService],
})
export class SeedModule {}
