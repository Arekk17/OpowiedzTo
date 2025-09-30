import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { PostTag } from '../entities/post-tag.entity';

@Injectable()
export class PostTagRepository extends Repository<PostTag> {
  constructor(private readonly dataSource: DataSource) {
    super(PostTag, dataSource.createEntityManager());
  }

  async findTagIdsByPostId(
    postId: string,
    manager?: EntityManager,
  ): Promise<string[]> {
    const em = manager ?? this.manager;
    const rows = await em.find(PostTag, { where: { postId } });
    return rows.map((r) => r.tagId);
  }
  async addMany(
    postId: string,
    tagIds: string[],
    manager?: EntityManager,
  ): Promise<void> {
    if (!tagIds.length) return;
    const em = manager ?? this.manager;
    const values = tagIds.map((tagId) => em.create(PostTag, { postId, tagId }));
    await em
      .createQueryBuilder()
      .insert()
      .into(PostTag)
      .values(values)
      .orIgnore()
      .execute();
  }

  async removeMany(
    postId: string,
    tagIds: string[],
    manager?: EntityManager,
  ): Promise<void> {
    if (!tagIds.length) return;
    const em = manager ?? this.manager;
    await em
      .createQueryBuilder()
      .delete()
      .from(PostTag)
      .where('postId = :postId', { postId })
      .andWhere('tagId IN (:...tagIds)', { tagIds })
      .execute();
  }
}
