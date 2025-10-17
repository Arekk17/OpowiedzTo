import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial20250101000000 implements MigrationInterface {
  name = 'Initial20250101000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "nickname" character varying NOT NULL,
        "avatar" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "UQ_users_nickname" UNIQUE ("nickname"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);

    // Create posts table
    await queryRunner.query(`
      CREATE TABLE "posts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "authorId" uuid NOT NULL,
        "title" character varying NOT NULL,
        "content" text NOT NULL,
        "likesCount" integer NOT NULL DEFAULT 0,
        "commentsCount" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_posts_id" PRIMARY KEY ("id")
      )
    `);

    // Create tags table
    await queryRunner.query(`
      CREATE TABLE "tags" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "slug" character varying NOT NULL,
        "postsCount" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_tags_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_tags_id" PRIMARY KEY ("id")
      )
    `);

    // Create post_tags junction table
    await queryRunner.query(`
      CREATE TABLE "post_tags" (
        "postId" uuid NOT NULL,
        "tagId" uuid NOT NULL,
        CONSTRAINT "PK_post_tags" PRIMARY KEY ("postId", "tagId")
      )
    `);

    // Create comments table
    await queryRunner.query(`
      CREATE TABLE "comments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "postId" uuid NOT NULL,
        "authorId" uuid NOT NULL,
        "content" text NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_comments_id" PRIMARY KEY ("id")
      )
    `);

    // Create post_likes table
    await queryRunner.query(`
      CREATE TABLE "post_likes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "postId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_post_likes_user_post" UNIQUE ("userId", "postId"),
        CONSTRAINT "PK_post_likes_id" PRIMARY KEY ("id")
      )
    `);

    // Create follows table
    await queryRunner.query(`
      CREATE TABLE "follows" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "followerId" uuid NOT NULL,
        "followingId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_follows_follower_following" UNIQUE ("followerId", "followingId"),
        CONSTRAINT "PK_follows_id" PRIMARY KEY ("id")
      )
    `);

    // Create refresh_tokens table
    await queryRunner.query(`
      CREATE TABLE "refresh_tokens" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "token" character varying NOT NULL,
        "expiresAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_refresh_tokens_token" UNIQUE ("token"),
        CONSTRAINT "PK_refresh_tokens_id" PRIMARY KEY ("id")
      )
    `);

    // Create reports tables
    await queryRunner.query(`
      CREATE TABLE "post_reports" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "postId" uuid NOT NULL,
        "reporterId" uuid NOT NULL,
        "reason" character varying NOT NULL,
        "description" text,
        "status" character varying NOT NULL DEFAULT 'pending',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_post_reports_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "comment_reports" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "commentId" uuid NOT NULL,
        "reporterId" uuid NOT NULL,
        "reason" character varying NOT NULL,
        "description" text,
        "status" character varying NOT NULL DEFAULT 'pending',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_comment_reports_id" PRIMARY KEY ("id")
      )
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "posts" 
      ADD CONSTRAINT "FK_posts_author" 
      FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "post_tags" 
      ADD CONSTRAINT "FK_post_tags_post" 
      FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "post_tags" 
      ADD CONSTRAINT "FK_post_tags_tag" 
      FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "comments" 
      ADD CONSTRAINT "FK_comments_post" 
      FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "comments" 
      ADD CONSTRAINT "FK_comments_author" 
      FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "post_likes" 
      ADD CONSTRAINT "FK_post_likes_user" 
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "post_likes" 
      ADD CONSTRAINT "FK_post_likes_post" 
      FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "follows" 
      ADD CONSTRAINT "FK_follows_follower" 
      FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "follows" 
      ADD CONSTRAINT "FK_follows_following" 
      FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "refresh_tokens" 
      ADD CONSTRAINT "FK_refresh_tokens_user" 
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "post_reports" 
      ADD CONSTRAINT "FK_post_reports_post" 
      FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "post_reports" 
      ADD CONSTRAINT "FK_post_reports_reporter" 
      FOREIGN KEY ("reporterId") REFERENCES "users"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "comment_reports" 
      ADD CONSTRAINT "FK_comment_reports_comment" 
      FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "comment_reports" 
      ADD CONSTRAINT "FK_comment_reports_reporter" 
      FOREIGN KEY ("reporterId") REFERENCES "users"("id") ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE "comment_reports"`);
    await queryRunner.query(`DROP TABLE "post_reports"`);
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "follows"`);
    await queryRunner.query(`DROP TABLE "post_likes"`);
    await queryRunner.query(`DROP TABLE "comments"`);
    await queryRunner.query(`DROP TABLE "post_tags"`);
    await queryRunner.query(`DROP TABLE "tags"`);
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
