/*
 * @since 2022-01-05 10:03:21
 * @author junbao <junbao@moego.pet>
 *
 * keep atomic boxes
 */

import { boolBox, numberBox } from 'amos-boxes';
import { box } from 'amos-core';
import { logoutSignal } from './session.signals';

export const countBox = numberBox('count');
logoutSignal.subscribe((dispatch) => dispatch(countBox.setState()));

export const darkModeBox = boolBox('ui.darkMode').config({ persist: { version: 1 } });

export const configBox = box('system.config', {
  api: 'https://github.com/amos-project/amos',
  env: 'testing',
});
