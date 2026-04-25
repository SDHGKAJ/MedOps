export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/tests/**/*.test.js', '!**/tests/**/e2e.test.js'],
  testPathIgnorePatterns: ['/tests/e2e.test.js'],
  testTimeout: 30000,
  verbose: true,
};
