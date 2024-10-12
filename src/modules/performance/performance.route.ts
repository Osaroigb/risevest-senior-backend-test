import { Router } from 'express';
import * as performanceController from './performance.controller';
import { authenticateUserJwt } from '../../middlewares/authenticate';

const router = Router();

router.get(
  '/top-users',
  authenticateUserJwt,
  performanceController.getTopUsersWithLatestComments,
);

export default router;
