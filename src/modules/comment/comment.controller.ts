import { User } from '../../entities/User.entity';
import * as commentService from './comment.service';
import { BadRequestError } from '../../errors/BadRequestError';
import { PageOptionsDto } from '../../pagination/page-options.dto';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const addComment: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const postIdParam = req.params.postId;

    // Validate that postId is a valid integer
    if (!/^\d+$/.test(postIdParam)) {
      throw new BadRequestError('Invalid post ID');
    }

    const postId = parseInt(postIdParam, 10);

    // User comes from the authenticate middleware
    const user = req.user as User;
    const userId = user.id;
    const commentData = req.body;

    const result = await commentService.addCommentToPost(
      postId,
      userId,
      commentData,
    );

    res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
};

export const getCommentsForPost: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const postIdParam = req.params.postId;

    // Validate that postId is a valid integer
    if (!/^\d+$/.test(postIdParam)) {
      throw new BadRequestError('Invalid post ID');
    }

    const postId = parseInt(postIdParam, 10);
    const pageOptions = new PageOptionsDto();
    Object.assign(pageOptions, req.query);

    const result = await commentService.getAllCommentsForPost(
      postId,
      pageOptions,
    );
    res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
};
