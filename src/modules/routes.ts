import { Router } from 'express';
import { routes as userRoutes } from './user';
import { routes as postRoutes } from './post';

export const initiateModuleRoutes = (router: Router): void => {
  router.use('/v1/users', userRoutes);
  router.use('/v1/posts', postRoutes);
};
