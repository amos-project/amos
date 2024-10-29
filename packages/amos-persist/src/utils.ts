/*
 * @since 2024-10-17 23:05:14
 * @author junbao <junbao@moego.pet>
 */

import { Box } from 'amos-core';
import { type ID, isObject, must } from 'amos-utils';
import { BoxPersistOptions, PersistOptions } from './types';

export const defaultVersion = 1;
export const delimiter = ':';

/**
 * Generate key in storage
 * @param box
 * @param rowId three types
 *      - null: generate multi-row prefix
 *      - undefined: generate single-row key
 *      - ID: generate multi-row key
 */
export function toKey(box: Box, rowId: ID | undefined | null) {
  if (rowId === void 0) {
    return box.key;
  }
  return box.key + delimiter + (rowId === null ? '' : rowId);
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
