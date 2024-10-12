import {
  loginUserValidator,
  createUserValidator,
} from '../../middlewares/user.validation';

import { Router } from 'express';
import * as userController from './user.controller';

const router = Router();

router.post('/', createUserValidator, userController.createUser);
router.post('/login', loginUserValidator, userController.loginUser);

router.get('/', userController.getAllUsers);
export default router;
