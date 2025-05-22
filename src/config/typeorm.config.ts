import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { config } from 'dotenv';

// Wczytanie zmiennych środowiskowych z pliku .env
config();

// Konfiguracja DataSource dla migracji
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'opowiedzto',
  entities: [User, Post],
  migrations: ['src/migrations/**/*.ts'],
  migrationsTableName: 'migrations',
};

// Tworzenie instancji DataSource
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
