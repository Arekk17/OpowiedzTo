import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './entities/post.entity';
import { PostRepository } from './repositories/post.repository';
import { PostLike } from './entities/post-like.entity';
import { Comment } from './entities/comment.entity';
import { PostLikeService } from './post-like.service';
import { CommentService } from './comment.service';
import { PostLikeController } from './post-like.controller';
import { CommentController } from './comment.controller';
import { PostLikeRepository } from './repositories/post-like.repository';
import { CommentRepository } from './repositories/comment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostLike, Comment])],
  controllers: [PostsController, PostLikeController, CommentController],
  providers: [
    PostsService,
    PostLikeService,
    CommentService,
    PostRepository,
    PostLikeRepository,
    CommentRepository,
  ],
  exports: [
    PostsService,
    PostLikeService,
    CommentService,
    PostRepository,
    PostLikeRepository,
    CommentRepository,
  ],
})
export class PostsModule {}
