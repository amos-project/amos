/*
 * @since 2024-10-16 11:11:14
 * @author junbao <junbao@moego.pet>
 */

import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { createAmosTransformer } from 'amos-typescript';
import * as fs from 'fs-extra';
import { upperFirst } from 'lodash';
import * as child_process from 'node:child_process';
import * as console from 'node:console';
import { rollup } from 'rollup';
import { dts } from 'rollup-plugin-dts';
import rollupPluginStripBanner from 'rollup-plugin-strip-banner';
import { autorun } from './utils';

export const build = autorun(
  module,
  () => [] as const,
  async () => {
    const entries = Object.entries({
      dist: 'index.ts',
      react: 'react.ts',
      typescript: 'typescript.ts',
      babel: 'babel.ts',
    });
    await fs.remove('dist');
    await Promise.all(entries.map(([d]) => fs.remove(`packages/amos/${d}`)));
    await Promise.all(
      entries.map(async ([name, file]) => {
        const input = `packages/amos/src/${file}`;
        const outDir = `packages/amos/${name}`;
        await fs.remove(outDir);
        const bundle = await rollup({
          input: input,
          external: (source) => {
            if (/^\.+\//.test(source)) {
              return false;
            }
            if (source.includes('tslib')) {
              return false;
            }
            if (!source.includes('amos')) {
              return true;
            }
            return source === 'amos';
          },
          plugins: [
            typescript({
              outputToFilesystem: false,
              outDir: '.',
              noEmit: true,
              declaration: false,
              emitDeclarationOnly: false,
              transformers: {
                before: [
                  createAmosTransformer(void 0, {
                    prefix: 'amos/',
                    format: 'lower_underscore',
                  }),
                ],
              },
            }),
            json(),
            rollupPluginStripBanner({}),
          ],
        });
        await Promise.all([
          bundle.write({ format: 'esm', sourcemap: true, file: `${outDir}/index.esm.js` }),
          bundle.write({
            format: 'cjs',
            sourcemap: true,
            file: `${outDir}/index.cjs.js`,
            exports: 'named',
          }),
          bundle.write({
            format: 'iife',
            sourcemap: true,
            name: name === 'dist' ? 'Amos' : 'Amos' + upperFirst(name),
            file: `${outDir}/index.min.js`,
            plugins: [terser()],
            globals: { amos: 'Amos', react: 'React', typescript: 'ts' },
            exports: 'named',
          }),
        ]);
        await bundle.close();
        if (name !== 'dist') {
          await fs.outputJSON(
            outDir + '/package.json',
            {
              main: './index.cjs.js',
              module: './index.esm.js',
              types: './index.d.ts',
            },
            { spaces: 2 },
          );
        }
        console.log('Bundled %s', name);
      }),
    );
    console.log('Generating types');
    child_process.execSync(`npx tsc`, { stdio: 'inherit' });
    console.log('Bundling types for %s packages', entries.length);
    await Promise.all(
      entries.map(async ([name, file]) => {
        const base = file.split('.')[0];
        const input = `./dist/packages/amos/src/${base}.d.ts`;
        const output = `packages/amos/${name}/index.d.ts`;
        const bundle = await rollup({
          input: input,
          external: (source) => {
            return !/^\.+\//.test(source) && !source.includes('amos') && !source.includes('tslib');
          },
          plugins: [
            alias({
              entries: [
                {
                  find: /^(amos-.*)$/,
                  replacement: '$1',
                  customResolver: (source, importer) => {
                    if (name === 'dist' || source.includes(name)) {
                      return process.cwd() + `/dist/packages/${source}/src/index.d.ts`;
                    }
                    return {
                      id: 'amos',
                      external: true,
                    };
                  },
                },
              ],
            }),
            json(),
            dts(),
          ],
        });
        await Promise.all([bundle.write({ format: 'esm', sourcemap: true, file: output })]);
        await bundle.close();
        console.log('Bundled types %s', name);
      }),
    );
    await fs.remove('dist');
    await fs.copyFile('README.md', 'packages/amos/README.md');
  },
);
