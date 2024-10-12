import {
  LoginUserValidationSchema,
  CreateUserValidationSchema,
} from './user.dto';

import dataSource from '../../config/ormconfig';
import { get, set, del } from '../../utils/redis';
import { User } from '../../entities/User.entity';
import { PageDto } from '../../pagination/page.dto';
import { ApiResponse } from '../../config/interface';
import { ConflictError } from '../../errors/ConflictError';
import { UnAuthorizedError } from '../../errors/UnAuthorizedError';
import { PageOptionsDto } from '../../pagination/page-options.dto';
import { ResourceNotFoundError } from '../../errors/ResourceNotFoundError';
import { generateJwt, hashString, isHashValid } from '../../helpers/utilities';
import { ONE_HOUR_IN_MILLISECONDS, USER_CACHE_KEY } from '../../utils/constant';

const userRepository = dataSource.getRepository(User);

export const processCreateUser = async (
  userData: CreateUserValidationSchema,
): Promise<ApiResponse> => {
  // Check if a user with the provided email already exists
  const existingUser = await userRepository.findOne({
    where: { email: userData.email },
  });

  if (existingUser) {
    throw new ConflictError('The Email already exists, please login');
  }

  const hashedPassword = await hashString(userData.password);

  const newUser = userRepository.create({
    ...userData,
    password: hashedPassword,
  });

  const savedUser = await userRepository.save(newUser);

  // Invalidate the user cache
  await del(USER_CACHE_KEY);

  return {
    success: true,
    message: 'User created successfully',
    statusCode: 201,
    data: {
      userId: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
    },
  };
};

export const processLoginUser = async (
  userData: LoginUserValidationSchema,
): Promise<ApiResponse> => {
  const user = await userRepository.findOne({
    where: { email: userData.email },
  });

  if (!user) throw new UnAuthorizedError('Email or Password is incorrect');

  const isValidPassword = await isHashValid(userData.password, user.password);
  if (!isValidPassword) throw new UnAuthorizedError('Password is incorrect');

  const jwt = generateJwt({
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    },
    sub: user.id.toString(),
  });

  return {
    success: true,
    message: 'Login successful',
    statusCode: 200,
    data: {
      auth: {
        ...jwt,
      },
      userId: user.id,
    },
  };
};

export const processGetAllUsers = async (
  pageOptions: PageOptionsDto,
): Promise<ApiResponse> => {
  const { skip, order, pageSize } = pageOptions;

  // Try to get the cached data from Redis
  const cachedUsers = await get(USER_CACHE_KEY);

  if (cachedUsers) {
    const users = JSON.parse(cachedUsers);
    const items = new PageDto(users, users.length, pageOptions);

    return {
      success: true,
      message: 'Users retrieved from cache',
      statusCode: 200,
      data: items.data,
      meta: items.meta,
    };
  }

  const [users, count] = await userRepository.findAndCount({
    order: { createdAt: order },
    skip,
    take: pageSize,
    select: ['id', 'name', 'email'],
  });

  // Cache the data in Redis for future requests up to 1 hour
  await set(USER_CACHE_KEY, JSON.stringify(users), ONE_HOUR_IN_MILLISECONDS);
  const items = new PageDto(users, count, pageOptions);

  // Return the paginated result
  return {
    success: true,
    message: 'Users retrieved successfully',
    statusCode: 200,
    data: items.data,
    meta: items.meta,
  };
};

export const findUserById = async (userId: number) => {
  const user = await userRepository.findOne({
    where: { id: userId },
  });

  if (!user) {
    throw new ResourceNotFoundError('User not found');
  }

  return user;
};
