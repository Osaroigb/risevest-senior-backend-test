# Risevest Backend Service

## Overview

The **Risevest Backend Service** is a RESTful API service that supports user authentication, post creation, comment management, and more. It is designed for scalability and security, leveraging Node.js with TypeORM and PostgreSQL for data storage. The service also integrates Redis for caching, allowing fast access to frequently requested data.

This project provides APIs for user registration, login, post creation, and fetching users with the most recent comments. The service is containerized using Docker, making it easy to set up in both local development and production environments.

## Features

- User authentication (signup, login)
- Post creation and management
- Comment creation and management
- Fetch top users with their latest comment
- PostgreSQL as the database
- Redis for caching
- Dockerized setup for easy deployment

## Table of Contents

- [Requirements](#requirements)
- [Setup Instructions](#setup-instructions)
  - [Local Setup](#local-setup)
  - [Running with Docker](#running-with-docker)
- [API Endpoints](#api-endpoints)
- [Running Tests](#running-tests)
- [Deployment](#deployment)

---

## Requirements

Make sure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/en/) (v16.x or higher)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- PostgreSQL for local development or use Docker for PostgreSQL service
- Redis for caching (can be configured via Docker or Redis Cloud)

---

## Setup Instructions

### Local Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Osaroigb/risevest-senior-backend-test.git
   cd risevest-senior-backend-test
   ```

2. **Install dependencies**

   Use npm:

   ```bash
   npm install
   ```

   Or use Yarn:

   ```bash
   yarn install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the root directory based on the `.env.example` file:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your environment variables, especially for database and Redis configuration:

   ```bash
   PORT=3300
   NODE_ENV=development
   SHOW_APP_LOGS=true

   DATABASE_HOST=127.0.0.1
   DATABASE_PORT=5432
   DATABASE_USER=your_db_user
   DATABASE_PASSWORD=your_db_password
   DATABASE_NAME=your_db_name

   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379
   ```

4. **Run the application**

   To start the application in development mode:

   ```bash
   npm run start:dev
   ```

   The API will be accessible at [http://localhost:3300](http://localhost:3300).

---

### Running with Docker

1. **Configure `.env`**

   Ensure your `.env` file is properly set up with Docker configurations:

   ```bash
   DATABASE_HOST=postgres
   REDIS_HOST=redis
   ```

2. **Run Docker Compose**

   Use Docker Compose to build and run your application along with PostgreSQL and Redis:

   ```bash
   docker-compose up --build
   ```

   This command will:

   - Build the Node.js application
   - Start PostgreSQL, Redis, and the backend service

3. **Access the API**
   The API will be accessible at [http://localhost:3300](http://localhost:3300).

---

## API Endpoints

### User Authentication

- `POST /v1/users/signup`: Register a new user.
- `POST /v1/users/login`: Authenticate a user and obtains a JWT token.

### Posts

- `POST /v1/users/:id/posts`: Create a new post for a user.
- `GET /v1/users/:id/posts`: Get all posts for a specific user.

### Comments

- `POST /v1/posts/:postId/comments`: Add a comment to a post.
- `GET /v1/posts/:postId/comments`: Get all comments for a post.

### Fetch Top Users with Latest Comments

- `GET /v1/performance/top-users`: Fetch top posters with their latest comments.

---

## Running Tests

The application is tested using Jest. Before running the tests, ensure that your environment variables for the test database are properly set. You can do this by adding the following to your `.env` file:

```bash
# Test Database Configuration
TEST_DATABASE_HOST=127.0.0.1
TEST_DATABASE_PORT=5432
TEST_DATABASE_NAME=test_risevest
TEST_DATABASE_USER=postgres
TEST_DATABASE_PASSWORD=your_password
```

Ensure that your test database is running locally, and that it is properly configured to accept connections.

### Running Individual Test Files

You can run individual test files using the following commands:

1. To run the `user.controller.test.ts` tests:

   ```bash
   npm run test -- tests/user.controller.test.ts
   ```

2. To run the `post.controller.test.ts` tests:

   ```bash
   npm run test -- tests/post.controller.test.ts
   ```

3. To run the `comment.controller.test.ts` tests:

   ```bash
   npm run test -- tests/comment.controller.test.ts
   ```

## Deployment

### Accessing the Live Backend Service

The backend service is live and accessible at the following URL:

**[Live URL](https://risevest-backend-d883eb3d4dcd.herokuapp.com)**

You can use tools like [Postman](https://www.postman.com/) or [curl](https://curl.se/) to interact with the available API endpoints.

For detailed information on the available endpoints, request/response formats, and error codes, refer to the **[API Documentation](https://documenter.getpostman.com/view/23691550/2sAXxS9Bot)**.

---

## License

This project is licensed under the Mozilla Public License.
