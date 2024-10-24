import { JestConfigWithTsJest } from 'ts-jest';

export default async (): Promise<JestConfigWithTsJest> => {
  return {
    setupFiles: ['<rootDir>/jest.setup.ts'],
    testEnvironment: 'node',
    transform: {
      '^.+.tsx?$': [
        'ts-jest',
        {
          astTransformers: {
            before: [
              {
                path: './packages/amos/typescript',
                options: {
                  prefix: 'amos/',
                  format: 'lower_underscore',
                },
              },
            ],
          },
        },
      ],
    },
    moduleNameMapper: {
      '^amos-([^/]+)$': '<rootDir>/packages/amos-$1/src',
    },
  };
};
