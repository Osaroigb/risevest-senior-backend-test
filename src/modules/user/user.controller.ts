import * as userService from './user.service';
import { PageOptionsDto } from '../../pagination/page-options.dto';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const createUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await userService.processCreateUser(req.body);

    res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
};

export const loginUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await userService.processLoginUser(req.body);

    res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Extract pagination options from query parameters
    const pageOptions = new PageOptionsDto();
    Object.assign(pageOptions, req.query);

    const result = await userService.processGetAllUsers(pageOptions);
    res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
};
