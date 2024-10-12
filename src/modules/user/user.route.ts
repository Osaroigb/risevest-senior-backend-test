import {
  loginUserValidator,
  createUserValidator,
} from '../../middlewares/user.validation';

import { Router } from 'express';
import * as userController from './user.controller';
import * as postController from '../post/post.controller';
import { authenticateUserJwt } from '../../middlewares/authenticate';
import { createPostValidator } from '../../middlewares/post.validation';

const router = Router();

router.post('/', createUserValidator, userController.createUser);
router.post('/login', loginUserValidator, userController.loginUser);

// Protected Routes
router.use(authenticateUserJwt);

// User Routes
router.get('/', userController.getAllUsers);

// Post Routes
router.post('/:id/posts', createPostValidator, postController.createPost);
router.get('/:id/posts', postController.getAllPostsForUser);

export default router;
