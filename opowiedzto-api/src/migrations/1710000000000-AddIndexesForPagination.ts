import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexesForPagination1710000000000
  implements MigrationInterface
{
  name = 'AddIndexesForPagination1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_posts_created_at" ON "posts" ("created_at" DESC)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_posts_author_id" ON "posts" ("author_id")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_posts_tags_gin" ON "posts" USING GIN ("tags")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_posts_title_content" ON "posts" USING GIN (to_tsvector('polish', title || ' ' || content))
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_users_email" ON "users" ("email")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_users_nickname" ON "users" ("nickname")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_comments_post_id" ON "comments" ("post_id")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_comments_author_id" ON "comments" ("author_id")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_post_likes_post_id" ON "post_likes" ("post_id")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_post_likes_user_id" ON "post_likes" ("user_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_posts_created_at"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_posts_author_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_posts_tags_gin"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_posts_title_content"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_email"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_nickname"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_comments_post_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_comments_author_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_post_likes_post_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_post_likes_user_id"`);
  }
}
