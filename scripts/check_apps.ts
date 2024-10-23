/*
 * @since 2024-10-23 00:52:23
 * @author junbao <junbao@moego.pet>
 */

import * as child_process from 'node:child_process';
import { autorun } from './utils';

export const check_apps = autorun(
  module,
  () => [] as [],
  async () => {
    const apps = ['examples', 'website'];
    for (const app of apps) {
      try {
        child_process.execSync(`git --no-pager grep -n -E "from ['\\"]amos-.*" -- ${app}`, {
          stdio: 'inherit',
        });
        console.error('%s should not import internal packages.', app);
      } catch (e: any) {
        if (e.status !== 1) {
          throw e;
        }
      }
    }
  },
);
