import dataSource from '../../config/ormconfig';
import { get, set, del } from '../../config/redis';
import { Post } from '../../entities/Post.entity';
import { PageDto } from '../../pagination/page.dto';
import { findUserById } from '../user/user.service';
import { ApiResponse } from '../../config/interface';
import { CreatePostValidationSchema } from './post.dto';
import { PageOptionsDto } from '../../pagination/page-options.dto';
import { ResourceNotFoundError } from '../../errors/ResourceNotFoundError';
import { ONE_HOUR_IN_MILLISECONDS, POST_CACHE_KEY } from '../../utils/constant';

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

  // Invalidate the post cache
  await del(POST_CACHE_KEY);

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

  // Try to get the cached data from Redis
  const cachedPosts = await get(POST_CACHE_KEY);

  if (cachedPosts) {
    const posts = JSON.parse(cachedPosts);
    const items = new PageDto(posts, posts.length, pageOptions);

    return {
      success: true,
      message: 'Posts retrieved from cache',
      statusCode: 200,
      data: items.data,
      meta: items.meta,
    };
  }

  // If not in cache, get paginated posts from DB
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

  // Cache the data in Redis for future requests up to 1 hour
  await set(POST_CACHE_KEY, JSON.stringify(posts), ONE_HOUR_IN_MILLISECONDS);
  const items = new PageDto(posts, count, pageOptions);

  return {
    success: true,
    message: 'Posts retrieved successfully',
    statusCode: 200,
    data: items.data,
    meta: items.meta,
  };
};

export const findPostById = async (postId: number) => {
  const post = await postRepository.findOne({
    where: { id: postId },
  });

  if (!post) {
    throw new ResourceNotFoundError('Post not found');
  }

  return post;
};
