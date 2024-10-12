import app from '../src/app';
import request from 'supertest';
import { ConflictError } from '../src/errors/ConflictError';
import * as userService from '../src/modules/user/user.service';

// Mock the user service module
jest.mock('../src/modules/user/user.service');

// Cast the specific functions to Jest mock functions
const mockProcessCreateUser = userService.processCreateUser as jest.Mock;
const mockProcessLoginUser = userService.processLoginUser as jest.Mock;

describe('User Controller Tests', () => {
  describe('POST /users', () => {
    it('should create a new user successfully', async () => {
      const mockUserData = {
        userId: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      };

      // Mock the service call
      mockProcessCreateUser.mockResolvedValue({
        success: true,
        message: 'User created successfully',
        statusCode: 201,
        data: mockUserData,
      });

      const res = await request(app).post('/v1/users').send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('John Doe');
      expect(mockProcessCreateUser).toHaveBeenCalled();
    });

    it('should return 409 if email already exists', async () => {
      mockProcessCreateUser.mockRejectedValue(
        new ConflictError('The Email already exists'),
      );

      const res = await request(app).post('/v1/users').send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      });

      expect(res.status).toBe(409);
    });

    it('should return 400 for invalid email format', async () => {
      const res = await request(app).post('/v1/users').send({
        name: 'John Doe',
        email: 'john@.com', // Invalid email format
        password: 'Password123!',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('email must be an email');
    });

    it('should return 400 for weak password', async () => {
      const res = await request(app).post('/v1/users').send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123', // No special character
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain(
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
      );
    });

    it('should return 400 for name shorter than 4 characters', async () => {
      const res = await request(app).post('/v1/users').send({
        name: 'Joe', // Shorter than 4 characters
        email: 'john@example.com',
        password: 'Password123!',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain(
        'Name must be between 4 and 50 characters',
      );
    });
  });

  describe('User Controller Tests - Login', () => {
    describe('POST /users/login', () => {
      it('should login successfully', async () => {
        mockProcessLoginUser.mockResolvedValue({
          success: true,
          message: 'Login successful',
          statusCode: 200,
          data: { auth: { token: 'jwt_token' } },
        });

        const res = await request(app)
          .post('/v1/users/login')
          .send({ email: 'john@example.com', password: 'Password123!' });

        expect(res.status).toBe(200);
        expect(res.body.data.auth.token).toBe('jwt_token');
      });

      it('should return 401 if login fails due to incorrect credentials', async () => {
        mockProcessLoginUser.mockRejectedValue(new Error('UnAuthorizedError'));

        const res = await request(app)
          .post('/v1/users/login')
          .send({ email: 'john@example.com', password: 'wrong_password' });

        expect(res.status).toBe(400);
      });

      it('should return 400 for invalid email format', async () => {
        const res = await request(app)
          .post('/v1/users/login')
          .send({ email: 'john@.com', password: 'Password123!' }); // Invalid email format

        expect(res.status).toBe(400);
        expect(res.body.message).toContain('email must be an email');
      });

      it('should return 400 for weak password (no number)', async () => {
        const res = await request(app)
          .post('/v1/users/login')
          .send({ email: 'john@example.com', password: 'Password!' }); // Weak password, no number

        expect(res.status).toBe(400);
        expect(res.body.message).toContain(
          'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
        );
      });

      it('should return 400 for missing password', async () => {
        const res = await request(app)
          .post('/v1/users/login')
          .send({ email: 'john@example.com', password: '' }); // Missing password

        expect(res.status).toBe(400);
        expect(res.body.message).toContain(
          'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
        );
      });

      it('should return 400 for missing email', async () => {
        const res = await request(app)
          .post('/v1/users/login')
          .send({ email: '', password: 'Password123!' }); // Missing email

        expect(res.status).toBe(400);
        expect(res.body.message).toContain('email must be an email');
      });
    });
  });
});
