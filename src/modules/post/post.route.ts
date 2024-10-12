import { Router } from 'express';
import * as commentController from '../comment/comment.controller';
import { authenticateUserJwt } from '../../middlewares/authenticate';
import { createCommentValidator } from '../../middlewares/comment.validation';

const router = Router();
router.use(authenticateUserJwt);

// Comment routes (Protected)
router.post(
  '/:postId/comments',
  createCommentValidator,
  commentController.addComment,
);

router.get('/:postId/comments', commentController.getCommentsForPost);
export default router;
