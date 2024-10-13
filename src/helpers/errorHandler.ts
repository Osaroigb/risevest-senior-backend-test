import { Response } from 'express';
import { logger } from '../utils/logger';
import { DomainError } from '../errors/DomainError';

export const handleError = (
  error: Error,
  responseStream?: Response,
): void | Response => {
  if (responseStream) {
    if (error instanceof DomainError) {
      return responseStream.status(error.getHttpCode()).send({
        success: error.getStatus(),
        message: error.message,
        data: error.getData ? error.getData() || {} : {},
      });
    }

    logger.warn('error from error handler!');
    logger.error(error);

    return responseStream.status(500).send({
      success: false,
      message:
        'Something went wrong, please try again. Reach out to us if issue persists',
      data: {},
    });
  }

  throw error;
};
