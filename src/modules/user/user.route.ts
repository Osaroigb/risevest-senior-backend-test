import {
  loginUserValidator,
  createUserValidator,
} from '../../middlewares/user.validation';

import { Router } from 'express';
import * as userController from './user.controller';
import { authenticateUserJwt } from '../../middlewares/authenticate';

const router = Router();

router.post('/', createUserValidator, userController.createUser);
router.post('/login', loginUserValidator, userController.loginUser);

router.get('/', authenticateUserJwt, userController.getAllUsers);
export default router;
