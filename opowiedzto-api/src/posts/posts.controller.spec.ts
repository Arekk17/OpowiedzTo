import { BadRequestException } from '@nestjs/common';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostFiltersDto } from './dto/pagination.dto';
import { encodeCursor } from './dto/cursor.dto';
import { User } from '../users/entities/user.entity';
import { PostWithDetailsDto } from './dto/post-with-details.dto';
import { Post } from './entities/post.entity';

describe('PostsController', () => {
  let controller: PostsController;
  let service: jest.Mocked<PostsService>;

  beforeEach(() => {
    service = {
      findAllCursor: jest.fn(),
      findOneWithDetails: jest.fn(),
      findByAuthor: jest.fn(),
      search: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      likePost: jest.fn(),
      unlikePost: jest.fn(),
      getLikes: jest.fn(),
      getLikeCount: jest.fn(),
    } as unknown as jest.Mocked<PostsService>;

    controller = new PostsController(service);
  });

  it('findAll dekoduje cursor i przekazuje parametry do serwisu', async () => {
    const filters: PostFiltersDto = {
      tag: 'tech',
      authorId: 'author-1',
      limit: 5,
      sortBy: undefined,
    };
    const cursorPayload = {
      createdAt: '2024-01-01T00:00:00.000Z',
      id: 'post-1',
      likesCount: 0,
      commentsCount: 0,
    };
    const cursor = encodeCursor(cursorPayload);
    const result = { data: [] as PostWithDetailsDto[], nextCursor: null, meta: { total: 0 } };
    service.findAllCursor.mockResolvedValue(result);

    await expect(controller.findAll(filters, cursor, { id: 'user-1' } as User)).resolves.toBe(
      result,
    );
    expect(service.findAllCursor).toHaveBeenCalledWith(
      'tech',
      'author-1',
      5,
      'user-1',
      undefined,
      cursorPayload,
    );
  });

  it('findAll obsługuje brak cursora', async () => {
    service.findAllCursor.mockResolvedValue({ data: [], nextCursor: null, meta: { total: 0 } });

    await controller.findAll({}, undefined, undefined);

    expect(service.findAllCursor).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      null,
    );
  });

  it('findOne odrzuca niepoprawne ID', () => {
    expect(() => controller.findOne('invalid-id', undefined)).toThrow(BadRequestException);
  });

  it('findOne deleguje do serwisu przy poprawnym ID', async () => {
    const post = { id: 'post-1' } as PostWithDetailsDto;
    service.findOneWithDetails.mockResolvedValue(post);

    await expect(
      controller.findOne('123e4567-e89b-12d3-a456-426614174000', { id: 'user-1' } as User),
    ).resolves.toBe(post);
    expect(service.findOneWithDetails).toHaveBeenCalledWith(
      '123e4567-e89b-12d3-a456-426614174000',
      'user-1',
    );
  });

  it('create deleguje do serwisu', async () => {
    const dto = { title: 'Post', content: 'Content' } as never;
    const user = { id: 'user-1' } as User;
    const post = { id: 'post-1' } as Post;
    service.create.mockResolvedValue(post);

    await expect(controller.create(dto, user)).resolves.toBe(post);
    expect(service.create).toHaveBeenCalledWith(dto, user);
  });

  it('update deleguje do serwisu', async () => {
    const post = { id: 'post-1' } as Post;
    service.update.mockResolvedValue(post);

    await expect(
      controller.update(
        '123e4567-e89b-12d3-a456-426614174000',
        { title: 'New' } as never,
        { id: 'user-1' } as User,
      ),
    ).resolves.toBe(post);
    expect(service.update).toHaveBeenCalledWith(
      '123e4567-e89b-12d3-a456-426614174000',
      { title: 'New' },
      { id: 'user-1' },
    );
  });

  it('remove deleguje do serwisu', async () => {
    await controller.remove('123e4567-e89b-12d3-a456-426614174000', {
      id: 'user-1',
    } as User);

    expect(service.remove).toHaveBeenCalledWith(
      '123e4567-e89b-12d3-a456-426614174000',
      'user-1',
    );
  });
});



