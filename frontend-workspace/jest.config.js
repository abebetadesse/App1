export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: { '\\.(css|less|scss)$': 'identity-obj-proxy' },
  collectCoverageFrom: ['src/**/*.{js,jsx}', '!src/**/*.test.js']
};
