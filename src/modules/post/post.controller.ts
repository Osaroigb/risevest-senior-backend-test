import * as postService from './post.service';
import { BadRequestError } from '../../errors/BadRequestError';
import { PageOptionsDto } from '../../pagination/page-options.dto';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const createPost: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const postData = req.body;
    const userIdParam = req.params.id;

    // Validate that userId is a valid integer
    if (!/^\d+$/.test(userIdParam)) {
      throw new BadRequestError('Invalid user ID');
    }

    const userId = parseInt(userIdParam, 10);
    const result = await postService.createPostForUser(userId, postData);
    res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllPostsForUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userIdParam = req.params.id;

    if (!/^\d+$/.test(userIdParam)) {
      throw new BadRequestError('Invalid user ID');
    }

    const userId = parseInt(userIdParam, 10);
    const pageOptions = new PageOptionsDto();
    Object.assign(pageOptions, req.query);

    const result = await postService.getPostsForUser(userId, pageOptions);
    res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
};
