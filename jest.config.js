/**
 * Jest Configuration - Quản Lý Sinh Viên và Giảng Viên
 */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js'],
  testTimeout: 30000,
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetModules: true,
  collectCoverageFrom: [
    'app.js',
    'models/**/*.js',
    'routes/**/*.js',
    '!node_modules/**',
    '!test/**',
  ],
};
