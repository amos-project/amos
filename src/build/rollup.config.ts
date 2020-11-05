/*
 * @since 2020-11-03 13:16:07
 * @author acrazing <joking.young@gmail.com>
 */

import commonjs from '@rollup/plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

const packageJson = require('../../package.json');

/** @type {RollupOptions} */
export default {
  input: 'src/index.ts',
  output: [
    { file: packageJson.main, format: 'cjs', sourcemap: true },
    { file: packageJson.module, format: 'es', sourcemap: true },
    { file: packageJson.umd, format: 'umd', sourcemap: true, name: 'Amos', plugins: [terser()] },
  ],
  external: Object.keys({
    ...packageJson.dependencies,
    ...packageJson.peerDependencies,
  }),
  plugins: [
    typescript({
      tsconfigOverride: {
        compilerOptions: { module: 'esnext' },
        exclude: ['src/example', 'src/build', 'src/**/*.spec.ts'],
      },
    }),
    commonjs(),
    resolve({ preferBuiltins: true }),
    sourceMaps(),
  ],
};
