/*
 * @since 2024-10-17 23:05:14
 * @author junbao <junbao@moego.pet>
 */

import { Box } from 'amos-core';
import { must } from 'amos-utils';
import { BoxPersistOptions, PersistOptions } from './types';

export function shouldPersist(options: PersistOptions, box: Box) {
  if (box.persist === false) {
    return false;
  }
  if (options.excludes?.(box)) {
    return false;
  }
  if (options.includes) {
    return options.includes(box);
  }
  return !!box.persist;
}

export function resolveBoxPersistOptions(
  options: PersistOptions,
  box: Box,
): BoxPersistOptions<any> {
  must(shouldPersist(options, box), `box ${box.key} should be persisted.`);
  if (!box.persist) {
    return { version: 1 };
  }
  return box.persist;
}
