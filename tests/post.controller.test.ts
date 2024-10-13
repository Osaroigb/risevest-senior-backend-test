import app from '../src/app';
import request from 'supertest';
import dataSource from '../src/config/ormconfig';
import * as postService from '../src/modules/post/post.service';
import { ResourceNotFoundError } from '../src/errors/ResourceNotFoundError';

// Mock the post service module
jest.mock('../src/modules/post/post.service');

// Cast the specific functions to Jest mock functions
const mockProcessCreatePost = postService.createPostForUser as jest.Mock;
const mockProcessGetUserPosts = postService.getPostsForUser as jest.Mock;

describe('Post Controller Tests', () => {
  let token: string;
  let userId: number;

  beforeAll(async () => {
    // Initialize the database before tests
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
      await dataSource.synchronize();
    }

    // Create a user for testing
    await request(app).post('/v1/users').send({
      name: 'Aomine Diaki',
      email: 'aomine@gmail.com',
      password: 'Password123!',
    });

    // Perform login to retrieve the token
    const loginResponse = await request(app)
      .post('/v1/users/login')
      .send({ email: 'aomine@gmail.com', password: 'Password123!' });

    token = loginResponse.body.data.auth.token;
    userId = loginResponse.body.data.userId;
  });

  afterAll(async () => {
    // Close the database connection after tests
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  describe('POST /users/:id/posts', () => {
    it('should create a new post successfully', async () => {
      const mockPostData = {
        title: 'My First Post',
        content:
          'This is the content of the post. It has more than 25 characters.',
      };

      // Mock the service call
      mockProcessCreatePost.mockResolvedValue({
        success: true,
        message: 'Post created successfully',
        statusCode: 201,
        data: mockPostData,
      });

      const res = await request(app)
        .post(`/v1/users/${userId}/posts`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'My First Post',
          content:
            'This is the content of the post. It has more than 25 characters.',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe('My First Post');
      expect(mockProcessCreatePost).toHaveBeenCalled();
    });

    it('should return 400 if title is less than 5 characters', async () => {
      const res = await request(app)
        .post(`/v1/users/${userId}/posts`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Hi',
          content:
            'This is the content of the post. It has more than 25 characters.',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain(
        'Title must be between 5 and 50 characters',
      );
    });

    it('should return 400 if content is less than 25 characters', async () => {
      const res = await request(app)
        .post(`/v1/users/${userId}/posts`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Valid Title',
          content: 'Short content',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain(
        'Content must be atleast 25 characters',
      );
    });

    it('should return 400 if user ID is invalid (non-numeric)', async () => {
      const res = await request(app)
        .post('/v1/users/23es3/posts')
        .set('Authorization', `Bearer ${token}`) // Invalid user ID
        .send({
          title: 'Valid Title',
          content: 'This is valid content with more than 25 characters.',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Invalid user ID');
    });

    it('should return 404 if the user does not exist', async () => {
      mockProcessCreatePost.mockRejectedValue(
        new ResourceNotFoundError('User not found'),
      );

      const res = await request(app)
        .post('/v1/users/999/posts') // Non-existent user ID
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Valid Title',
          content: 'This is valid content with more than 25 characters.',
        });

      expect(res.status).toBe(404);
      expect(res.body.message).toContain('User not found');
    });

    it('should return 401 if Authorization header is not provided', async () => {
      const res = await request(app)
        .post(`/v1/users/${userId}/posts`) // No Authorization header
        .send({
          title: 'My First Post',
          content:
            'This is the content of the post. It has more than 25 characters.',
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Authorization token is required');
    });
  });

  describe('GET /users/:id/posts', () => {
    it('should get all posts for a user successfully', async () => {
      const mockPostsData = [
        {
          postId: 1,
          title: 'My First Post',
          content: 'This is the content of the first post.',
        },
        {
          postId: 2,
          title: 'My Second Post',
          content: 'This is the content of the second post.',
        },
      ];

      // Mock the service call
      mockProcessGetUserPosts.mockResolvedValue({
        success: true,
        message: 'Posts retrieved successfully',
        statusCode: 200,
        data: mockPostsData,
      });

      const res = await request(app)
        .get(`/v1/users/${userId}/posts`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(mockProcessGetUserPosts).toHaveBeenCalled();
    });

    it('should return 404 if the user does not exist when retrieving posts', async () => {
      mockProcessGetUserPosts.mockRejectedValue(
        new ResourceNotFoundError('User not found'),
      );

      const res = await request(app)
        .get('/v1/users/999/posts')
        .set('Authorization', `Bearer ${token}`); // Non-existent user ID

      expect(res.status).toBe(404);
      expect(res.body.message).toContain('User not found');
    });

    it('should return 400 if user ID is invalid when retrieving posts', async () => {
      const res = await request(app)
        .get('/v1/users/23es3/posts')
        .set('Authorization', `Bearer ${token}`); // Invalid user ID

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Invalid user ID');
    });

    it('should return 401 if Authorization header is not provided', async () => {
      const res = await request(app).get(`/v1/users/${userId}/posts`); // No Authorization header

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Authorization token is required');
    });
  });
});
