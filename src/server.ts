import {
  handleError,
  onListening,
  normalizePort,
  gracefulShutdown,
} from './helpers/server';

import app from './app';
import http from 'http';
import stoppable from 'stoppable';
import appConfig from './config/app';
import { logger } from './utils/logger';
import dataSource from './config/ormconfig';

const port =
  Number(process.env.APP_PORT) || appConfig.get('port') || normalizePort(3300);
app.set('port', port);

/**
 * Create HTTP server
 */
const server = http.createServer(app);

/**
 * Initialize database connection and start the server
 */
const startServer = async () => {
  try {
    // Initialize the database using the dataSource from ormconfig.ts
    await dataSource.initialize();
    logger.info('Database connected successfully!');

    /**
     * Listen on the provided port, on all network interfaces
     */
    server.listen(port);
    server.on('error', (error) => handleError(error, port));
    server.on('listening', () => onListening(server));

    // Handle graceful shutdown
    process.on('SIGINT', () =>
      gracefulShutdown(stoppable(server), 'Got SIGINT. Graceful shutdown'),
    );

    process.on('SIGTERM', () =>
      gracefulShutdown(stoppable(server), 'Got SIGTERM. Graceful shutdown'),
    );
  } catch (error) {
    logger.error(
      'Failed to start the server due to database connection error',
      error,
    );

    process.exit(1); // Exit process with failure code
  }
};

// Start the server
startServer();
