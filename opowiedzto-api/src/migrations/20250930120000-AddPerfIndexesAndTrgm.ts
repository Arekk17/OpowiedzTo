import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPerfIndexesAndTrgm20250930120000 implements MigrationInterface {
  name = 'AddPerfIndexesAndTrgm20250930120000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // pg_trgm
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm`);

    // posts — kursor NEWEST
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_posts_createdAt_id_desc ON posts ("createdAt" DESC, "id" DESC)`,
    );

    // post_likes — spójność i szybkie sprawdzenie polubienia
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS uq_post_likes_user_post ON post_likes ("userId", "postId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_post_likes_post ON post_likes ("postId")`,
    );

    // tags — unikalność + szybkie ILIKE/suggest
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS uq_tags_slug ON tags ("slug")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_tags_slug_gin ON tags USING gin ("slug" gin_trgm_ops)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_tags_name_gin ON tags USING gin ("name" gin_trgm_ops)`,
    );

    // post_tags — najczęstszy kierunek: posty po tagu
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_post_tags_tag_post ON post_tags ("tagId", "postId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_post_tags_tag_post`);

    await queryRunner.query(`DROP INDEX IF EXISTS idx_tags_name_gin`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_tags_slug_gin`);
    await queryRunner.query(`DROP INDEX IF EXISTS uq_tags_slug`);

    await queryRunner.query(`DROP INDEX IF EXISTS idx_post_likes_post`);
    await queryRunner.query(`DROP INDEX IF EXISTS uq_post_likes_user_post`);

    await queryRunner.query(`DROP INDEX IF EXISTS idx_posts_createdAt_id_desc`);

    // Nie usuwamy rozszerzenia pg_trgm (jest współdzielone na DB)
    // Jeśli koniecznie chcesz:
    // await queryRunner.query(`DROP EXTENSION IF EXISTS pg_trgm`);
  }
}
