import { Router } from 'express';
import { routes as userRoutes } from './user';
import { routes as postRoutes } from './post';
import { routes as performanceRoutes } from './performance';

export const initiateModuleRoutes = (router: Router): void => {
  router.use('/v1/users', userRoutes);
  router.use('/v1/posts', postRoutes);
  router.use('/v1/performance', performanceRoutes);
};
