import { Injectable } from '@nestjs/common';
import { TagRepository } from './repository/tag.repository';
import { Tag } from './entities/tag.entity';

type OrderBy = 'count' | 'tag';

@Injectable()
export class TagsService {
  constructor(private readonly tagRepository: TagRepository) {}

  list(
    search?: string,
    page: number = 1,
    limit: number = 20,
    orderBy: OrderBy = 'count',
    order: 'ASC' | 'DESC' = 'DESC',
  ): Promise<{ data: Tag[]; total: number }> {
    return this.tagRepository.findAllTags(search, page, limit, orderBy, order);
  }

  suggest(q: string, limit: number = 10): Promise<Tag[]> {
    return this.tagRepository.suggest(q, limit);
  }

  findOneBySlug(slug: string): Promise<Tag | null> {
    return this.tagRepository.findOneBySlug(slug);
  }

  findBySlugs(slugs: string[]): Promise<Tag[]> {
    return this.tagRepository.findBySlugs(slugs);
  }

  async upsertManyBySlugs(slugs: string[]): Promise<void> {
    const uniq = Array.from(
      new Set(slugs.map((s) => s.trim().toLowerCase()).filter(Boolean)),
    );
    if (!uniq.length) return;
    const existing = await this.tagRepository.findBySlugs(uniq);
    const existingSlugs = new Set(existing.map((t) => t.slug));
    const toCreate = uniq
      .filter((s) => !existingSlugs.has(s))
      .map((s) => ({ name: s, slug: s }));
    if (toCreate.length) await this.tagRepository.insert(toCreate);
  }

  async incrementPostCount(slugs: string[], delta: number): Promise<void> {
    const uniq = Array.from(
      new Set(slugs.map((s) => s.trim().toLowerCase()).filter(Boolean)),
    );
    if (!uniq.length) return;
    await this.tagRepository
      .createQueryBuilder()
      .update()
      .set({ postCount: () => `GREATEST(postCount + ${delta}, 0)` })
      .where('slug IN (:...slugs)', { slugs: uniq })
      .execute();
  }

  getTrendingTags(
    limit: number = 6,
  ): Promise<{ tag: string; count: number }[]> {
    return this.tagRepository.getTrendingTags(limit);
  }
}
