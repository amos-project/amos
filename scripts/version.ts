/*
 * @since 2024-10-16 14:06:06
 * @author junbao <junbao@moego.pet>
 */

import * as fs from 'fs-extra';
import { pick } from 'lodash';
import * as child_process from 'node:child_process';
import yargs from 'yargs';
import { autorun } from './utils';

export const version = autorun(
  module,
  () =>
    [
      pick(
        yargs
          .options({
            update: {
              type: 'string',
              choices: ['major', 'minor', 'patch', 'beta'],
              demandOption: true,
            },
          })
          .help()
          .strict()
          .parseSync(),
        'update',
      ),
    ] as const,
  async ({ update }) => {
    const root = await fs.readJSON('package.json');
    const [major, minor, patch, , beta] = root.version.split(/[.-]/g);
    let version: string;
    switch (update) {
      case 'major':
        version = `${+major + 1}.0.0`;
        break;
      case 'minor':
        version = `${major}.${+minor + 1}.0`;
        break;
      case 'patch':
        version = `${major}.${minor}.${+patch + 1}`;
        break;
      case 'beta':
        version = `${major}.${minor}.${patch}-beta.${+(beta || 0) + 1}`;
        break;
      default:
        throw new Error(`invalid update target: ${update}`);
    }
    root.version = version;
    await fs.outputJSON('package.json', root, { spaces: 2 });
    const pkgs = await fs.readdir('packages');
    for (const p of pkgs) {
      const pjFile = `packages/${p}/package.json`;
      const pj = await fs.readJSON(pjFile);
      pj.version = version;
      await fs.outputJSON(pjFile, pj, { spaces: 2 });
    }
    child_process.execSync(`git add -A; git commit -m "feat: v${version}"`, { stdio: 'inherit' });
  },
);
