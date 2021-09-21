/*
 * @since 2021-08-14 17:43:46
 * @author junbao <junbao@mymoement.com>
 */

import { Cache } from './types';

export class MapCache<T> implements Cache<T> {
  get(id: string): T | undefined {
    return undefined;
  }

  set(id: string, value: T): void {}

  delete(id: string): void {}
}
