import { DatabaseType } from 'typeorm';

export interface DatabaseConfig {
  type: DatabaseType;
  database: string;
  host: string;
  port: number;
  username: string;
  password: string;
  synchronize: boolean;
  logging: boolean;
  autoLoadEntities: boolean;
  ssl?: {
    rejectUnauthorized: boolean;
  };
}

interface PaginationResponse {
  page: number;
  pageSize: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: any;
  meta?: PaginationResponse;
}
