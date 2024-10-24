/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  setupFiles: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  moduleNameMapper: {
    '^amos-([^/]+)$': '<rootDir>/packages/amos-$1/src',
  },
};
