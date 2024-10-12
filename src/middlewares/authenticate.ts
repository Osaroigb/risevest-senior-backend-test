import { logger } from '../utils/logger';
import dataSource from 'src/config/ormconfig';
import { User } from 'src/entities/User.entity';
import { verifyJwt } from '../helpers/utilities';
import { UnAuthorizedError } from '../errors/UnAuthorizedError';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const authenticateUserJwt: RequestHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    let userPayload;
    const { authorization } = req.headers;

    if (!authorization || typeof authorization !== 'string') {
      throw new UnAuthorizedError('Authorization token is required');
    }

    const [authType, authToken] = req.headers.authorization?.split(' ') || [];

    if (authType !== 'Bearer') {
      throw new UnAuthorizedError('Invalid authorization token');
    }

    const userRepository = dataSource.getRepository(User);

    try {
      const payload = verifyJwt(authToken);
      userPayload = payload;

      if (!payload.sub) {
        throw new UnAuthorizedError('Invalid authorization token');
      }

      const user = await userRepository.findOne({
        where: { id: +payload.sub },
      });

      if (!user) {
        throw new UnAuthorizedError('Invalid authorization token');
      }

      req.user = user;
    } catch (error) {
      logger.error(
        `[middlewares.authenticate.authenticateUserJwt] => ${error}`,
        { userPayload },
      );

      throw new UnAuthorizedError('Invalid authorization token');
    }

    next();
  } catch (error) {
    next(error);
  }
};
