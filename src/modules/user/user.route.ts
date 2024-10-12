import { createUserValidator } from '../../middlewares/user.validation';

import { Router } from 'express';
import * as userController from './user.controller';

const router = Router();

router.post('/', createUserValidator, userController.createUser);
export default router;
