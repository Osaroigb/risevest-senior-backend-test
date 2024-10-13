import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,js}', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    // '/tests/user.controller.test.ts',
    // '/tests/post.controller.test.ts',
    // '/tests/comment.controller.test.ts',
  ],
};

export default config;
