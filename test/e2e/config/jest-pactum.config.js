module.exports = {
  displayName: 'e2e-pactum',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../../../',
  testEnvironment: 'node',
  testMatch: ['**/test/e2e/specs/**/*.pactum.e2e-spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: {
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@paralleldrive/cuid2|@noble/hashes|pactum|pactum-matchers)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  globalSetup: '<rootDir>/test/e2e/setup/global-setup.ts',
  globalTeardown: '<rootDir>/test/e2e/setup/global-teardown.ts',
  setupFilesAfterEnv: ['<rootDir>/test/e2e/helpers/pactum-config.ts'],
  testTimeout: 30000,
  verbose: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.spec.ts',
    '!src/**/__tests__/**',
    '!src/**/*.module.ts',
    '!src/**/*.dto.ts',
    '!src/**/*.entity.ts',
    '!src/**/*.enum.ts',
    '!src/**/*.interface.ts',
    '!src/**/*.config.ts',
    '!src/main.ts',
  ],
  coverageDirectory: 'coverage-e2e',
  preset: 'ts-jest',
};
