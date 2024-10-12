import dataSource from '../../config/ormconfig';
import { Post } from '../../entities/Post.entity';
import { PageDto } from '../../pagination/page.dto';
import { findUserById } from '../user/user.service';
import { ApiResponse } from '../../config/interface';
import { CreatePostValidationSchema } from './post.dto';
import { PageOptionsDto } from '../../pagination/page-options.dto';

const postRepository = dataSource.getRepository(Post);

export const createPostForUser = async (
  userId: number,
  postData: CreatePostValidationSchema,
): Promise<ApiResponse> => {
  const user = await findUserById(userId);

  // Create the new post associated with the user
  const newPost = postRepository.create({
    ...postData,
    user,
  });

  const savedPost = await postRepository.save(newPost);

  return {
    success: true,
    message: 'Post created successfully',
    statusCode: 201,
    data: {
      id: savedPost.id,
      title: savedPost.title,
      userId: savedPost.user.id,
    },
  };
};

export const getPostsForUser = async (
  userId: number,
  pageOptions: PageOptionsDto,
): Promise<ApiResponse> => {
  const user = await findUserById(userId);
  const { skip, order, pageSize } = pageOptions;

  // Get paginated posts for the user
  const [posts, count] = await postRepository.findAndCount({
    where: { user: { id: user.id } },
    order: { createdAt: order },
    skip,
    take: pageSize,
  });

  if (!posts.length) {
    return {
      success: true,
      message: 'No posts found for this user',
      statusCode: 200,
      data: [],
    };
  }

  return {
    success: true,
    message: 'Posts retrieved successfully',
    statusCode: 200,
    data: new PageDto(posts, count, pageOptions),
  };
};
