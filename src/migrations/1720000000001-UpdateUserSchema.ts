import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserSchema1720000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Dodaj enum dla gender
    await queryRunner.query(`
      CREATE TYPE "public"."users_gender_enum" AS ENUM ('male', 'female', 'other')
    `);

    // Dodaj kolumnę gender
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN "gender" "public"."users_gender_enum" NOT NULL DEFAULT 'other'
    `);

    // Usuń niepotrzebne kolumny
    await queryRunner.query(`
      ALTER TABLE "users" 
      DROP COLUMN IF EXISTS "firstName",
      DROP COLUMN IF EXISTS "lastName",
      DROP COLUMN IF EXISTS "phoneNumber"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Przywróć usunięte kolumny
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN IF NOT EXISTS "firstName" varchar,
      ADD COLUMN IF NOT EXISTS "lastName" varchar,
      ADD COLUMN IF NOT EXISTS "phoneNumber" varchar
    `);

    // Usuń kolumnę gender
    await queryRunner.query(`
      ALTER TABLE "users" 
      DROP COLUMN IF EXISTS "gender"
    `);

    // Usuń typ enum
    await queryRunner.query(`
      DROP TYPE IF EXISTS "public"."users_gender_enum"
    `);
  }
}
