module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@zuno/shared-types$': '<rootDir>/../../packages/shared-types/src',
    '^@zuno/shared-validation$': '<rootDir>/../../packages/shared-validation/src',
    '^@zuno/ui$': '<rootDir>/../../packages/ui/src',
  },
};

