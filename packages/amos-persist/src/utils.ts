/*
 * @since 2024-10-17 23:05:14
 * @author junbao <junbao@moego.pet>
 */

import { Box } from 'amos-core';
import { type ID, isObject, must } from 'amos-utils';
import { BoxPersistOptions, PersistOptions } from './types';

const defaultVersion = 1;
const delimiter = ':';

export function toKey(key: string, rowId: ID | undefined | null): string;
export function toKey(box: Box, rowId?: ID | undefined | null): string;
export function toKey(box: Box | string, rowId?: ID | undefined | null) {
  const key = typeof box === 'string' ? box : box.key;
  if (arguments.length === 1) {
    must(typeof box !== 'string', 'key must use with rowId');
    rowId = box.table ? null : void 0;
  }
  if (rowId === void 0) {
    return key;
  }
  return key + delimiter + (rowId === null ? '' : rowId);
}

export function fromKey(key: string): string | undefined {
  const pos = key.indexOf(delimiter);
  if (pos === -1) {
    return void 0;
  }
  return key.substring(pos + 1);
}

const defaultOptions: BoxPersistOptions<any> = {
  version: defaultVersion,
};

export function toPersistOptions(box: Box): BoxPersistOptions<any> {
  return isObject(box.persist) ? box.persist : defaultOptions;
}

export function shouldPersist(options: PersistOptions, box: Box) {
  if (box.persist === false) {
    return false;
  }
  if (box.key.startsWith('amos.')) {
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
