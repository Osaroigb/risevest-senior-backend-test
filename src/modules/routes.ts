import { Router } from 'express';
// import { routes as userRoutes } from './user';

export const initiateModuleRoutes = (router: Router): void => {
  router.use('/v1/user');
};
