/*
 * @since 2024-10-16 11:11:14
 * @author junbao <junbao@moego.pet>
 */

import { rollup } from 'rollup';
import * as fs from 'fs-extra';
import typescript from '@rollup/plugin-typescript';
import * as child_process from 'node:child_process';
import { dts } from 'rollup-plugin-dts';
import * as console from 'node:console';
import { autorun } from './utils';

export const build = autorun(
  module,
  () => [] as const,
  async () => {
    const pkgs = fs.readdirSync('packages');
    console.log('Bundling %s packages', pkgs.length);
    await Promise.all(
      pkgs.map(async (pkg) => {
        const root = `packages/${pkg}`;
        await fs.remove(root + '/dist');
        const bundle = await rollup({
          input: `${root}/src/index.ts`,
          external: (source) => {
            return !/^\.+\//.test(source) && !source.includes(`/${root}/`);
          },
          plugins: [
            typescript({
              outputToFilesystem: false,
              outDir: `${root}/dist`,
              emitDeclarationOnly: false,
              noEmit: true,
              declaration: false,
            }),
          ],
        });
        await Promise.all([
          bundle.write({ format: 'esm', sourcemap: true, file: `${root}/dist/index.esm.js` }),
          bundle.write({ format: 'cjs', sourcemap: true, file: `${root}/dist/index.cjs.js` }),
        ]);
        await bundle.close();
        console.log('Bundled %s', pkg);
      }),
    );
    console.log('Generating types');
    await fs.remove('dist');
    child_process.execSync(`npx tsc`, { stdio: 'inherit' });
    console.log('Bundling types for %s packages', pkgs.length);
    await Promise.all(
      pkgs.map(async (pkg) => {
        const root = `packages/${pkg}`;
        const bundle = await rollup({
          input: `dist/${root}/src/index.d.ts`,
          external: (source) => {
            return !/^\.+\//.test(source) && !source.includes(`/${root}/`);
          },
          plugins: [dts()],
        });
        await Promise.all([
          bundle.write({ format: 'esm', sourcemap: true, file: `${root}/dist/index.d.ts` }),
        ]);
        await bundle.close();
        console.log('Bundled types %s', pkg);
      }),
    );
  },
);
