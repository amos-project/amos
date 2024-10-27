/*
 * @since 2024-10-16 15:01:23
 * @author junbao <junbao@moego.pet>
 */

import * as fs from 'fs-extra';
import { glob } from 'glob';
import { autorun } from './utils';

export const check_deps = autorun(
  module,
  () => [] as [],
  async () => {
    const r = await fs.readJSON('package.json');
    const pkgs = await fs.readdir('packages');
    const ext = ['amos-react'];
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
        pj: {
          name,
          dependencies = {},
          devDependencies,
          peerDependencies = {},
          optionalDependencies = {},
        },
      },
    ] of Object.entries(pkgInfo)) {
      const checkNoAmosInPkgDeps = () => {
        for (const dm of [
          dependencies,
          devDependencies || {},
          peerDependencies,
          optionalDependencies,
        ]) {
          for (const d in dm) {
            if (d.startsWith('amos')) {
              console.error(`no amos in deps: ${d} in ${pkg}`);
            }
          }
        }
      };
      const checkName = () => {
        if (name !== pkg) {
          console.error('%s name is %s', pkg, name);
        }
      };
      const checkNoInternalOrRootDeps = () => {
        if (ext.includes(name)) {
          const bad = deps.filter((d) => d.startsWith('amos-') && d !== 'amos-utils');
          if (bad.length > 0) {
            console.error('%s should not deps on %s', pkg, bad.join(', '));
          }
        } else if (deps.includes('amos')) {
          console.error(`%s should not dependents on amos.`, pkg);
        }
        if (devDeps.includes('amos')) {
          console.error(`%s should not dev dependents on amos.`, pkg);
        }
        if (pkg === 'amos-utils') {
          const bad = deps.concat(devDeps).filter((d) => d.startsWith('amos'));
          if (bad.length) {
            console.error('amos-utils no amos deps: ', bad.join(', '));
          }
        }
      };
      const checkNoSrcAndExternalPkgDeps = () => {
        for (const d of deps) {
          if (d.includes('src')) {
            console.error('%s import bad path %s', pkg, d);
          }
          if (d.startsWith('./') || d.startsWith('../')) {
            continue;
          }
          if (d.startsWith('amos')) {
            continue;
          }
          if (!dependencies[d] && !peerDependencies[d]) {
            console.error('%s dependents on %s not specified', pkg, d);
          }
        }
        for (const d of devDeps) {
          if (d.includes('src')) {
            console.error('%s import bad path %s', pkg, d);
          }
          if (d.startsWith('./') || d.startsWith('../')) {
            continue;
          }
          if (d.startsWith('amos')) {
            continue;
          }
          if (!r.devDependencies?.[d] && !r.dependencies?.[d] && !r.peerDependencies?.[d]) {
            console.error('%s dev dependents on %s not specified', pkg, d);
          }
        }
      };
      const checkDepUsage = () => {
        for (const d in dependencies) {
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
      };

      checkName();
      checkNoAmosInPkgDeps();
      checkDepUsage();
      checkNoSrcAndExternalPkgDeps();
      checkNoInternalOrRootDeps();
    }
  },
);
