/*
 * @since 2024-10-16 15:01:23
 * @author junbao <junbao@moego.pet>
 */

import { autorun } from './utils';
import * as fs from 'fs-extra';
import { glob } from 'glob';

export const check_deps = autorun(
  module,
  () => [] as [],
  async () => {
    const r = await fs.readJSON('package.json');
    const pkgs = await fs.readdir('packages');
    const pkgInfo: Record<string, { deps: string[]; devDeps: string[]; pj: any }> = {};
    for (const pkg of pkgs) {
      const deps = new Set<string>();
      const devDeps = new Set<string>();
      const pj = await fs.readJSON(`packages/${pkg}/package.json`);
      const files = await glob(`packages/${pkg}/src/**/*.{ts,tsx}`);
      for (const f of files) {
        const isDev = f.includes('.spec.');
        const d = await fs.readFile(f, 'utf-8');
        const ms = d.matchAll(/ from ['"]([^'"]+)['"]/g);
        for (const m of ms) {
          isDev ? devDeps.add(m[1]) : deps.add(m[1]);
        }
      }
      pkgInfo[pkg] = { deps: Array.from(deps), devDeps: Array.from(devDeps), pj };
    }
    for (const [
      pkg,
      {
        deps,
        devDeps,
        pj: { name, dependencies = {}, devDependencies, peerDependencies = {} },
      },
    ] of Object.entries(pkgInfo)) {
      if (name !== pkg) {
        console.error('%s name is %s', pkg, name);
      }
      if (deps.includes('amos') || devDeps.includes('amos')) {
        console.error(`%s should not dependents on amos.`, pkg);
      }
      if (deps.includes('amos-testing')) {
        console.error('%s should not dependents on amos-testing.', pkg);
      }
      for (const d of deps) {
        if (d.startsWith('./') || d.startsWith('../')) {
          if (d.includes('src')) {
            console.error('%s import bad path %s', pkg, d);
          }
          continue;
        }
        if (!dependencies[d] && !peerDependencies[d]) {
          console.error('%s dependents on %s not specified', pkg, d);
        }
      }
      for (const d of devDeps) {
        if (d.startsWith('./') || d.startsWith('../')) {
          if (d.includes('src')) {
            console.error('%s import bad path %s', pkg, d);
          }
          continue;
        }
        if (d.startsWith('amos')) {
          continue;
        }
        if (!r.devDependencies?.[d] && !r.dependencies?.[d] && !r.peerDependencies?.[d]) {
          console.error('%s dev dependents on %s not specified', pkg, d);
        }
      }
      for (const d in dependencies) {
        if (d === 'tslib') {
          continue;
        }
        if (!deps.includes(d) && !deps.includes(d.replace(/^@types\//, ''))) {
          console.error('%s unused dependencies %s', pkg, d);
        }
      }
      for (const d in peerDependencies) {
        if (!deps.includes(d) && !deps.includes(d.replace(/^@types\//, ''))) {
          console.error('%s unused dependencies %s', pkg, d);
        }
      }
      if (devDependencies) {
        console.error('%s devDependencies is not empty', pkg);
      }
    }
  },
);
