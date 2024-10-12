import { Request, Response, NextFunction } from 'express';
import * as performanceService from './performance.service';

export const getTopUsersWithLatestComments = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await performanceService.fetchTopUsersWithLatestComments();
    res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
};
