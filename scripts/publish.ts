/*
 * @since 2024-10-16 14:25:53
 * @author junbao <junbao@moego.pet>
 */

import { autorun } from './utils';
import { pick } from 'lodash';
import yargs from 'yargs';
import { version } from './version';
import { build } from './build';
import * as fs from 'fs-extra';
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
              choices: ['major', 'minor', 'patch', 'beta', 'none'],
              default: 'none',
            },
            withBuild: {
              type: 'boolean',
              default: true,
            },
          })
          .help()
          .strict()
          .parseSync(),
        'updateVersion',
        'withBuild',
      ),
    ] as const,
  async ({ updateVersion, withBuild }) => {
    if (updateVersion !== 'none') {
      await version({ update: updateVersion });
    }
    if (withBuild) {
      await build();
    }
    const pkgs = await fs.readdir('packages');
    for (const pkg of pkgs) {
      child_process.execSync(`npm publish --registry https://registry.npmjs.com`, {
        stdio: 'inherit',
        cwd: process.cwd() + '/packages/' + pkg,
      });
    }
  },
);
