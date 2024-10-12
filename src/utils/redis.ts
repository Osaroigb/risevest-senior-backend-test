import { logger } from './logger';
import { createClient } from 'redis';
import appConfig from '../config/app';

const { username, password, host, port } = appConfig.get('redis');

const client = createClient({
  url: `redis://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${encodeURIComponent(host)}:${port}`,
});

client.on('connect', (): any => {
  logger.info('Redis client connected');
});

client.on('error', (err: any): any => {
  logger.error(`Redis: Something went wrong ${err}`);
});

export const initiateConnection = async (): Promise<void> => {
  await client.connect();
};

export const terminateConnection = async (): Promise<void> => {
  client.disconnect();
  logger.info('Redis client disconnected');
};

export const get = (key: string): Promise<string | null> => client.get(key);

export const set = async (
  key: string,
  value: number | string,
  expiryInMilliseconds?: number,
): Promise<string | null> => {
  const setValue = await client.set(key, value);

  if (expiryInMilliseconds) {
    await client.expire(key, expiryInMilliseconds / 1000);
  }

  return setValue;
};

export const del = (key: string): Promise<number> => client.del(key);

export const exists = (key: string): Promise<number> => client.exists(key);

export const expire = (
  key: string,
  expiryInMilliseconds: number,
): Promise<boolean> => client.expire(key, expiryInMilliseconds / 1000);
