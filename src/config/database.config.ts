import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { Follow } from '../users/entities/follow.entity';
import { Comment } from '../posts/entities/comment.entity';
import { PostLike } from '../posts/entities/post-like.entity';
import { config } from 'dotenv';

// Wczytanie zmiennych środowiskowych z pliku .env
config();

// Konfiguracja DataSource dla migracji
export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'opowiedzto',
  entities: [User, Post, Follow, Comment, PostLike],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV !== 'production',
  migrations: ['dist/migrations/**/*.js'],
  migrationsRun: true,
  migrationsTableName: 'migrations',
};
