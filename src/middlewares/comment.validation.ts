import { validateOrReject } from 'class-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { CreateCommentValidationSchema } from '../modules/comment/comment.dto';

export const createCommentValidator: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const commentData = new CreateCommentValidationSchema();
    commentData.content = req.body.content;

    await validateOrReject(commentData);

    next();
  } catch (error: any) {
    const message = Object.values(error[0].constraints)[0];
    res.status(400).send({ message });
  }
};
