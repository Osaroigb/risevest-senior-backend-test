import {
  LoginUserValidationSchema,
  CreateUserValidationSchema,
} from './user.dto';

import dataSource from '../../config/ormconfig';
import { User } from '../../entities/User.entity';
import { ApiResponse } from '../../config/interface';
import { ConflictError } from '../../errors/ConflictError';
import { UnAuthorizedError } from 'src/errors/UnAuthorizedError';
import { generateJwt, hashString, isHashValid } from '../../helpers/utilities';

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

  return {
    success: true,
    message: 'User created successfully',
    statusCode: 201,
    data: savedUser,
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
