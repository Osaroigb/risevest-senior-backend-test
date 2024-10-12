import { validateOrReject } from 'class-validator';
import { BadRequestError } from '../errors/BadRequestError';
import { CreatePostValidationSchema } from '../modules/post/post.dto';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const createPostValidator: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.body) {
      throw new BadRequestError('Missing request body');
    }

    const postData = new CreatePostValidationSchema();
    postData.title = req.body.title;
    postData.content = req.body.content;

    await validateOrReject(postData);
    next();
  } catch (error: any) {
    const message = Object.values(error[0].constraints)[0];
    res.status(400).send({ message });
  }
};
