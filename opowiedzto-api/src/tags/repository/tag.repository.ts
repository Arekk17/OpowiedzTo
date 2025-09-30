import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';
import { slugify } from '../../helpers/slugify';

@Injectable()
export class TagRepository extends Repository<Tag> {
  constructor(private readonly dataSource: DataSource) {
    super(Tag, dataSource.createEntityManager());
  }

  async findBySlugs(slugs: string[]): Promise<Tag[]> {
    if (!slugs?.length) return [];
    return this.find({ where: { slug: In(slugs) } });
  }

  async suggest(q: string, limit: number = 10): Promise<Tag[]> {
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
    if (!q || q.trim() === '') return [];

    const searchVariants = this.createSearchVariants(q);

    return this.createQueryBuilder('t')
      .where(
        't.slug ILIKE ANY(:searchVariants) OR t.name ILIKE ANY(:searchVariants)',
        {
          searchVariants: searchVariants.map((v) => `${v}%`),
        },
      )
      .orderBy('t.postCount', 'DESC')
      .addOrderBy('t.slug', 'ASC')
      .limit(safeLimit)
      .getMany();
  }

  async findAllTags(
    search?: string,
    page: number = 1,
    limit: number = 20,
    orderBy: 'count' | 'tag' = 'count',
    order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{ data: Tag[]; total: number }> {
    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);
    const safePage = Math.max(Number(page) || 1, 1);

    const qb = this.createQueryBuilder('t');

    if (search && search.trim() !== '') {
      const searchVariants = this.createSearchVariants(search);
      qb.where(
        't.slug ILIKE ANY(:searchVariants) OR t.name ILIKE ANY(:searchVariants)',
        {
          searchVariants: searchVariants.map((v) => `%${v}%`),
        },
      );
    }
    const orderCol = orderBy === 'tag' ? 't.slug' : 't.postCount';
    qb.orderBy(orderCol, order);

    const total = await qb.getCount();
    const data = await qb
      .skip((safePage - 1) * safeLimit)
      .take(safeLimit)
      .getMany();

    return { data, total };
  }

  async findOneBySlug(input: string): Promise<Tag | null> {
    const trimmed = (input || '').trim();
    if (!trimmed) return null;

    const { slug: inputSlug } = slugify(trimmed);
    if (inputSlug) {
      const bySlug = await this.findOne({ where: { slug: inputSlug } });
      if (bySlug) return bySlug;
    }

    const inputLower = trimmed.toLowerCase();
    return this.createQueryBuilder('t')
      .where('LOWER(t.name) = :name', { name: inputLower })
      .getOne();
  }

  async getTrendingTags(
    limit: number = 6,
  ): Promise<{ tag: string; count: number }[]> {
    const rows = await this.createQueryBuilder('t')
      .select(['t.slug AS tag', 't.postCount AS count'])
      .orderBy('t.postCount', 'DESC')
      .limit(limit)
      .getRawMany<{ tag: string; count: string }>();
    return rows.map((r) => ({ tag: r.tag, count: parseInt(r.count, 10) }));
  }

  private createSearchVariants(input: string): string[] {
    const variants = new Set<string>();

    variants.add(input.toLowerCase().trim());

    const { slug } = slugify(input);
    if (slug) {
      variants.add(slug);
    }

    const withoutPolish = input
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
    if (withoutPolish) {
      variants.add(withoutPolish);
    }

    return Array.from(variants).filter(Boolean);
  }
}
