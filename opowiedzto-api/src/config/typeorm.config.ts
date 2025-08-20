import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { Follow } from '../users/entities/follow.entity';
import { Comment } from '../posts/entities/comment.entity';
import { PostLike } from '../posts/entities/post-like.entity';
import { PostReport } from '../reports/entities/post-report.entity';
import { CommentReport } from '../reports/entities/comment-report.entity';

config();

const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'opowiedzto',
  entities: [User, Post, Follow, Comment, PostLike, PostReport, CommentReport],
  migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
  migrationsTableName: 'migrations',
  migrationsRun: process.env.NODE_ENV === 'production',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  ssl:
    process.env.NODE_ENV === 'production'
      ? {
          rejectUnauthorized: false,
        }
      : false,
  connectTimeoutMS: 10000,
  extra: {
    max: 20,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 10000,
    maxUses: 7500,
  },
};

export default new DataSource(options);
