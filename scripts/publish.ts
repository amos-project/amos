/*
 * @since 2024-10-16 14:25:53
 * @author junbao <junbao@moego.pet>
 */

import { autorun, getPackages } from './utils';
import { pick } from 'lodash';
import yargs from 'yargs';
import { version } from './version';
import { build } from './build';
import * as child_process from 'node:child_process';
import * as process from 'node:process';

export const publish = autorun(
  module,
  () =>
    [
      pick(
        yargs
          .options({
            updateVersion: {
              type: 'string',
              choices: ['major', 'minor', 'patch', 'beta'],
              default: 'beta',
            },
            withBuild: {
              type: 'boolean',
              default: true,
            },
            unpublish: {
              type: 'string',
              default: false,
            },
          })
          .help()
          .strict()
          .parseSync(),
        'updateVersion',
        'withBuild',
        'unpublish',
      ),
    ] as const,
  async ({ updateVersion, withBuild, unpublish }) => {
    await version({ update: updateVersion });
    const pkgs = await getPackages();
    if (unpublish) {
      for (const pkg of pkgs.slice()) {
        console.log('Unpublishing ', pkg);
        child_process.execSync(
          `npm deprecate ${pkg}@${unpublish} 'bad version' --registry https://registry.npmjs.com`,
          {
            stdio: 'inherit',
            cwd: process.cwd() + '/packages/' + pkg,
          },
        );
      }
      return;
    }
    if (withBuild) {
      await build();
    }
    for (const pkg of pkgs) {
      const tag = updateVersion === 'beta' ? 'beta' : 'latest';
      child_process.execSync(`npm publish --registry https://registry.npmjs.com --tag ${tag}`, {
        stdio: 'inherit',
        cwd: process.cwd() + '/packages/' + pkg,
      });
    }
  },
);
