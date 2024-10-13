import dotenv from 'dotenv';
import { DatabaseConfig } from './interface';
import { parse } from 'pg-connection-string';

dotenv.config();

export const getConfig = (): DatabaseConfig => {
  const isHeroku = !!process.env.DATABASE_URL;

  if (isHeroku) {
    // Use DATABASE_URL for Heroku
    const parsed = parse(process.env.DATABASE_URL as string);

    return {
      type: 'postgres',
      host: parsed.host || '127.0.0.1',
      port: Number(parsed.port) || 5432,
      username: parsed.user || 'postgres',
      password: parsed.password || 'password',
      database: parsed.database || 'postgres',
      autoLoadEntities: true,
      synchronize: false,
      ssl: {
        rejectUnauthorized: false,
      },
    };
  }

  if (process.env.NODE_ENV === 'test') {
    // Test setup
    return {
      type: 'postgres',
      host: process.env.TEST_DATABASE_HOST || '127.0.0.1',
      port: Number(process.env.TEST_DATABASE_PORT) || 5432,
      username: process.env.TEST_DATABASE_USER || 'postgres',
      password: process.env.TEST_DATABASE_PASSWORD || 'password',
      database: process.env.TEST_DATABASE_NAME || 'test_risevest',
      autoLoadEntities: true,
      synchronize: true,
    };
  }

  // Development setup
  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'risevest',
    autoLoadEntities: true,
    synchronize: true,
  };
};
