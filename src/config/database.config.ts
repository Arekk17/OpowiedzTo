import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'opowiedzto',
  entities: [User, Post],
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
  migrations: ['dist/migrations/**/*.js'],
  migrationsRun: true,
};
