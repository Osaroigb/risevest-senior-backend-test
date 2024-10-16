import {
  CreateUserValidationSchema,
  LoginUserValidationSchema,
} from '../modules/user/user.dto';

import { validateOrReject } from 'class-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const createUserValidator: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = new CreateUserValidationSchema();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;

    await validateOrReject(user);
    next();
  } catch (error: any) {
    // handles the error generated by class-validator
    const message = Object.values(error[0].constraints)[0];
    res.status(400).send({ message });
  }
};

export const loginUserValidator: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = new LoginUserValidationSchema();
    user.email = req.body.email;
    user.password = req.body.password;

    await validateOrReject(user);
    next();
  } catch (error: any) {
    const message = Object.values(error[0].constraints)[0];
    res.status(400).send({ message });
  }
};
