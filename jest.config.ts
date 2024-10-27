import { TransformerOptions } from 'amos-utils';
import { JestConfigWithTsJest } from 'ts-jest';

export default async (): Promise<JestConfigWithTsJest> => {
  return {
    setupFiles: ['<rootDir>/jest.setup.ts'],
    testMatch: ['<rootDir>/packages/*/src/**/*.spec.ts?(x)'],
    testEnvironment: 'jest-environment-jsdom',
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
                  format: 'original',
                } satisfies TransformerOptions,
              },
            ],
          },
        },
      ],
    },
    moduleNameMapper: {
      '^amos-([^/]+)$': '<rootDir>/packages/amos-$1/src',
      '^amos$': '<rootDir>/packages/amos/src',
    },
  };
};
