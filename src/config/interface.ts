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
}
