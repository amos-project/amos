/*
 * @since 2024-10-16 14:07:31
 * @author junbao <junbao@moego.pet>
 */

import * as fs from 'fs-extra';

export const autorun = <A extends any[], R>(
  module: NodeModule,
  args: () => A,
  fn: (...args: A) => R,
): ((...args: A) => R) => {
  if (require.main === module) {
    Promise.resolve(args()).then((args) => fn(...args));
  }
  return fn;
};

export const getPackages = async () => {
  const pkgs = await fs.readdir('packages');
  const tree: Record<string, string[]> = {};
  for (const pkg of pkgs) {
    const pj = await fs.readJSON(`packages/${pkg}/package.json`);
    tree[pkg] = Object.keys(pj.dependencies);
  }
  const out: string[] = [];
  while (true) {
    const items = Object.entries(tree);
    if (!items.length) {
      break;
    }
    for (const [k, v] of items) {
      if (!v.some((v) => v.startsWith('amos') && !out.includes(v))) {
        out.push(k);
        delete tree[k];
      }
    }
  }
  return out;
};
