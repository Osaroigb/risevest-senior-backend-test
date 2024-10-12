import dotenv from 'dotenv';
import { DatabaseConfig } from './interface';

// Load environment variables from .env
dotenv.config();

// Function to get database configuration object
export const getConfig = (): DatabaseConfig => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST || '127.0.0.1',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'risevest',
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  logging: process.env.DATABASE_LOGGING === 'true',
  autoLoadEntities: true,
});
