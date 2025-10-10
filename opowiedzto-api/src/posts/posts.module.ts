import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './entities/post.entity';
import { PostsRepository } from './repositories/posts.repository';
import { CommentRepository } from './repositories/comment.repository';
import { PostLikeRepository } from './repositories/post-like.repository';
import { PostLike } from './entities/post-like.entity';
import { Comment } from './entities/comment.entity';
import { PostLikeService } from './post-like.service';
import { PostLikeController } from './post-like.controller';
import { CommentController } from './comment.controller';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostLike, Comment]), TagsModule],
  controllers: [PostsController, PostLikeController, CommentController],
  providers: [
    PostsService,
    PostLikeService,
    PostsRepository,
    CommentRepository,
    PostLikeRepository,
  ],
  exports: [PostsService, PostLikeService, PostsRepository],
})
export class PostsModule {}
