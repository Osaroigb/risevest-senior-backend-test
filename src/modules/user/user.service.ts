import dataSource from '../../config/ormconfig';
import { User } from '../../entities/User.entity';
import { ApiResponse } from '../../config/interface';
import { hashString } from '../../helpers/utilities';
import { CreateUserValidationSchema } from './user.dto';
import { ConflictError } from '../../errors/ConflictError';

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
