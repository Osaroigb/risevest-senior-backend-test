import {
  CreateUserValidationSchema,
  LoginUserValidationSchema,
} from '../modules/user/user.dto';

import { validateOrReject } from 'class-validator';
import { BadRequestError } from '../errors/BadRequestError';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const createUserValidator: RequestHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.body) {
      throw new BadRequestError('Missing request body');
    }

    const user = new CreateUserValidationSchema();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;

    await validateOrReject(user);
    next();
  } catch (error) {
    next(error);
  }
};

export const loginUserValidator: RequestHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.body) {
      throw new BadRequestError('Missing request body');
    }

    const user = new LoginUserValidationSchema();
    user.email = req.body.email;
    user.password = req.body.password;

    await validateOrReject(user);
    next();
  } catch (error) {
    next(error);
  }
};
