import structuredClone from '@ungap/structured-clone';
import 'fake-indexeddb/auto';

globalThis.structuredClone = structuredClone as any;

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

process.env.NODE_ENV = 'development';
