/*
 * @since 2022-01-05 10:03:21
 * @author junbao <junbao@moego.pet>
 *
 * keep atomic boxes
 */

import { BoolBox, NumberBox } from 'amos-boxes';
import { Box } from 'amos-core';
import { LOGOUT } from './session.signals';

export const countBox = new NumberBox('count').subscribe(LOGOUT, () => 0);

export const darkModeBox = new BoolBox('ui.darkMode').config({ persist: { version: 1 } });

export const configBox = new Box('system.config', {
  api: 'https://github.com/amos-project/amos',
  env: 'testing',
});
