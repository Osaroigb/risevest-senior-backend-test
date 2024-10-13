import app from '../src/app';
import request from 'supertest';
import dataSource from '../src/config/ormconfig';
import * as commentService from '../src/modules/comment/comment.service';
import { ResourceNotFoundError } from '../src/errors/ResourceNotFoundError';

// Mock the comment service module
jest.mock('../src/modules/comment/comment.service');

// Cast the specific functions to Jest mock functions
const mockAddCommentToPost = commentService.addCommentToPost as jest.Mock;
const mockGetAllCommentsForPost =
  commentService.getAllCommentsForPost as jest.Mock;

describe('Comment Controller Tests', () => {
  let token: string;
  let postId: number;
  let userId: number;

  beforeAll(async () => {
    // Initialize the database before tests
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
      await dataSource.synchronize();
    }

    // Create a user and a post for testing
    await request(app).post('/v1/users').send({
      name: 'Tensa Zangetsu',
      email: 'zangetsu@gmail.com',
      password: 'Password123!',
    });

    // Perform login to retrieve the token
    const loginResponse = await request(app)
      .post('/v1/users/login')
      .send({ email: 'zangetsu@gmail.com', password: 'Password123!' });

    token = loginResponse.body.data.auth.token;
    userId = loginResponse.body.data.userId;

    // Create a post for the user
    const postResponse = await request(app)
      .post(`/v1/users/${userId}/posts`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'My First Post',
        content:
          'This is the content of the post. It has more than 25 characters.',
      });

    postId = postResponse.body.data.id;
  });

  afterAll(async () => {
    // Close the database connection after tests
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  describe('POST /posts/:postId/comments', () => {
    it('should add a comment to the post successfully', async () => {
      const mockCommentData = {
        id: 1,
        comment: 'This is a valid comment',
      };

      // Mock the service call
      mockAddCommentToPost.mockResolvedValue({
        success: true,
        message: 'Comment added successfully',
        statusCode: 201,
        data: mockCommentData,
      });

      const res = await request(app)
        .post('/v1/posts/1/comments')
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'This is a valid comment',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.comment).toBe('This is a valid comment');
      expect(mockAddCommentToPost).toHaveBeenCalled();
    });

    it('should return 400 for invalid postId', async () => {
      const res = await request(app)
        .post(`/v1/posts/abc123/comments`) // Invalid postId
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'This is a valid comment',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Invalid post ID');
    });

    it('should return 404 if post does not exist', async () => {
      mockAddCommentToPost.mockRejectedValue(
        new ResourceNotFoundError('Post not found'),
      );

      const res = await request(app)
        .post(`/v1/posts/9999/comments`) // Valid but non-existent postId
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'This is a valid comment',
        });

      expect(res.status).toBe(404);
      expect(res.body.message).toContain('Post not found');
    });

    it('should return 400 for comment content less than 5 characters', async () => {
      const res = await request(app)
        .post(`/v1/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: '1234', // Invalid content (less than 5 characters)
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain(
        'Comment must be between 5 and 225 characters',
      );
    });

    it('should return 401 if Authorization header is not provided', async () => {
      const res = await request(app).post(`/v1/posts/${postId}/comments`).send({
        content: 'This is a valid comment',
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Authorization token is required');
    });
  });

  describe('GET /posts/:postId/comments', () => {
    it('should retrieve all comments for the post successfully', async () => {
      const mockCommentsData = [
        {
          id: 1,
          comment: 'This is the first comment',
          user: {
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
        {
          id: 2,
          comment: 'This is the second comment',
          user: {
            name: 'Jane Doe',
            email: 'jane@example.com',
          },
        },
      ];

      // Mock the service call
      mockGetAllCommentsForPost.mockResolvedValue({
        success: true,
        message: 'Comments retrieved successfully',
        statusCode: 200,
        data: mockCommentsData,
      });

      const res = await request(app)
        .get('/v1/posts/1/comments')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(mockGetAllCommentsForPost).toHaveBeenCalled();
    });

    it('should return 404 if post does not exist when retrieving comments', async () => {
      mockGetAllCommentsForPost.mockRejectedValue(
        new ResourceNotFoundError('Post not found'),
      );

      const res = await request(app)
        .get(`/v1/posts/9999/comments`)
        .set('Authorization', `Bearer ${token}`); // Non-existent post ID

      expect(res.status).toBe(404);
      expect(res.body.message).toContain('Post not found');
    });

    it('should return 400 for invalid postId when retrieving comments', async () => {
      const res = await request(app)
        .get(`/v1/posts/23es3/comments`)
        .set('Authorization', `Bearer ${token}`); // Invalid postId

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Invalid post ID');
    });

    it('should return 401 if Authorization header is not provided', async () => {
      const res = await request(app).get(`/v1/posts/${postId}/comments`); // No Authorization header

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Authorization token is required');
    });
  });
});
