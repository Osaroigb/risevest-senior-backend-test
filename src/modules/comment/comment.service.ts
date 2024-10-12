import dataSource from '../../config/ormconfig';
import { PageDto } from '../../pagination/page.dto';
import { findUserById } from '../user/user.service';
import { findPostById } from '../post/post.service';
import { ApiResponse } from '../../config/interface';
import { Comment } from '../../entities/Comment.entity';
import { CreateCommentValidationSchema } from './comment.dto';
import { PageOptionsDto } from '../../pagination/page-options.dto';

const commentRepository = dataSource.getRepository(Comment);

export const addCommentToPost = async (
  postId: number,
  userId: number,
  commentData: CreateCommentValidationSchema,
): Promise<ApiResponse> => {
  const user = await findUserById(userId);
  const post = await findPostById(postId);

  // Create and save the comment
  const newComment = commentRepository.create({
    content: commentData.content,
    user,
    post,
  });

  const savedComment = await commentRepository.save(newComment);

  return {
    success: true,
    message: 'Comment added successfully',
    statusCode: 201,
    data: {
      id: savedComment.id,
      comment: savedComment.content,
    },
  };
};

export const getAllCommentsForPost = async (
  postId: number,
  pageOptions: PageOptionsDto,
): Promise<ApiResponse> => {
  const post = await findPostById(postId);
  const { skip, order, pageSize } = pageOptions;

  // Fetch comments for the post with pagination
  const [comments, count] = await commentRepository.findAndCount({
    where: { post: { id: post.id } },
    order: { createdAt: order },
    skip,
    take: pageSize,
    relations: ['user'],
    select: {
      user: {
        name: true,
        email: true,
      },
    },
  });

  if (!comments.length) {
    return {
      success: true,
      message: 'No comments found for this post',
      statusCode: 200,
      data: [],
    };
  }

  const items = new PageDto(comments, count, pageOptions);

  return {
    success: true,
    message: 'Comments retrieved successfully',
    statusCode: 200,
    data: items.data,
    meta: items.meta,
  };
};
