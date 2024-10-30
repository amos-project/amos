/*
 * @since 2022-01-05 10:03:21
 * @author junbao <junbao@moego.pet>
 *
 * keep atomic boxes
 */

import { boolBox, numberBox } from 'amos-boxes';
import { action, box } from 'amos-core';
import { LOGOUT } from './session.signals';

export const countBox = numberBox('count');
LOGOUT.subscribe((dispatch) => dispatch(countBox.setState()));

const migrateDarkMode = action((dispatch, select, version, rowId, state) => {
  return state * 2 + version;
});

export const darkModeBox = boolBox('ui.darkMode').config({
  persist: {
    version: 2,
    migrate: migrateDarkMode,
  },
});

export const configBox = box('system.config', {
  api: 'https://github.com/amos-project/amos',
  env: 'testing',
});
