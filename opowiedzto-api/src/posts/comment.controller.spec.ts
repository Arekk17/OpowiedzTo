import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { CommentController } from './comment.controller';
import { CommentRepository } from './repositories/comment.repository';
import { PostsRepository } from './repositories/posts.repository';
import { CreateCommentDto } from './dto/create-comment.dto';

describe('CommentController', () => {
  let controller: CommentController;
  let commentRepository: jest.Mocked<CommentRepository>;
  let postsRepository: jest.Mocked<PostsRepository>;

  beforeEach(() => {
    commentRepository = {
      save: jest.fn(),
      findByPost: jest.fn(),
      findWithAuthor: jest.fn(),
      delete: jest.fn(),
      countComments: jest.fn(),
    } as unknown as jest.Mocked<CommentRepository>;

    postsRepository = {
      findEntityById: jest.fn(),
      incrementCommentsCount: jest.fn(),
      findCommentWithAuthor: jest.fn(),
    } as unknown as jest.Mocked<PostsRepository>;

    controller = new CommentController(commentRepository, postsRepository);
  });

  describe('createComment', () => {
    const dto: CreateCommentDto = { content: 'Świetny post!' };
    const user = { id: 'user-1' } as never;

    it('rzuca NotFound, gdy post nie istnieje', async () => {
      postsRepository.findEntityById.mockResolvedValue(null);

      await expect(
        controller.createComment('post-1', dto, user),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('rzuca BadRequest, gdy komentarz zawiera zabronione słowa', async () => {
      postsRepository.findEntityById.mockResolvedValue({
        id: 'post-1',
      } as never);

      await expect(
        controller.createComment('post-1', { content: 'Ty idiota!' }, user),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(commentRepository.save).not.toHaveBeenCalled();
    });

    it('zapisuje komentarz i zwiększa licznik', async () => {
      postsRepository.findEntityById.mockResolvedValue({
        id: 'post-1',
      } as never);
      const saved = { id: 'comment-1' } as never;
      commentRepository.save.mockResolvedValue(saved);
      postsRepository.incrementCommentsCount.mockResolvedValue();

      await expect(controller.createComment('post-1', dto, user)).resolves.toBe(
        saved,
      );
      expect(commentRepository.save).toHaveBeenCalledWith({
        postId: 'post-1',
        authorId: 'user-1',
        content: 'Świetny post!',
      });
      expect(postsRepository.incrementCommentsCount).toHaveBeenCalledWith(
        'post-1',
        1,
      );
    });
  });

  describe('getComments', () => {
    it('stosuje limit do 10 elementów', async () => {
      const comments = [{ id: 'c1' } as never];
      commentRepository.findByPost.mockResolvedValue(comments);

      await expect(controller.getComments('post-1', '100')).resolves.toBe(
        comments,
      );
      expect(commentRepository.findByPost).toHaveBeenCalledWith('post-1', 10);
    });

    it('ustawia minimalny limit na 1', async () => {
      commentRepository.findByPost.mockResolvedValue([]);

      await controller.getComments('post-1', '0');

      expect(commentRepository.findByPost).toHaveBeenCalledWith('post-1', 1);
    });
  });

  describe('deleteComment', () => {
    const user = { id: 'user-1' } as never;

    it('rzuca NotFound, gdy komentarz nie istnieje', async () => {
      commentRepository.findWithAuthor.mockResolvedValue(null);

      await expect(
        controller.deleteComment('comment-1', user),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('rzuca Forbidden, gdy autor nie jest właścicielem', async () => {
      commentRepository.findWithAuthor.mockResolvedValue({
        id: 'comment-1',
        authorId: 'other',
        postId: 'post-1',
      } as never);

      await expect(
        controller.deleteComment('comment-1', user),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('usuwa komentarz i aktualizuje licznik', async () => {
      commentRepository.findWithAuthor.mockResolvedValue({
        id: 'comment-1',
        authorId: 'user-1',
        postId: 'post-1',
      } as never);

      await controller.deleteComment('comment-1', user);

      expect(commentRepository.delete).toHaveBeenCalledWith('comment-1');
      expect(postsRepository.incrementCommentsCount).toHaveBeenCalledWith(
        'post-1',
        -1,
      );
    });
  });

  it('getCommentCount zwraca liczbę komentarzy', async () => {
    commentRepository.countComments.mockResolvedValue(5);

    await expect(controller.getCommentCount('post-1')).resolves.toEqual({
      count: 5,
    });
  });
});
