import { config as loadEnv } from 'dotenv';
import { getConfig as getDBConfig } from './database';
import { DataSourceOptions, DataSource } from 'typeorm';

loadEnv();
const dbConfig = getDBConfig();

const dataSourceOptions: DataSourceOptions = {
  ...dbConfig,
  type: <any>dbConfig.type,
  entities: [`${__dirname}/../entities/*entity{.ts,.js}`],
  migrations: [`${__dirname}/../migrations/*{.ts,.js}`],
  bigNumberStrings: true,
  multipleStatements: true,
  logging: true,
  migrationsRun: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
