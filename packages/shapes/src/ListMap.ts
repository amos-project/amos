/*
 * @since 2020-12-03 11:42:27
 * @author acrazing <joking.young@gmail.com>
 */

import { List } from './List';
import { createMapBox, Map } from './Map';

export class ListMap<K extends keyof any, T> extends Map<K, List<T>> {
  constructor(items?: T[], inferKey?: K) {
    super(new List<T>(items), inferKey);
  }

  setList(key: K, items: T[]): this {
    return this.set(key, new List<T>(items));
  }

  setAllList(items: readonly (readonly [K, T[]])[]): this {
    return this.setAll(items.map(([key, items]) => [key, new List<T>(items)]));
  }
}

export const createListDictBox = createMapBox.extend(ListMap, {
  mutations: { setList: {}, setLists: {} },
  selectors: {},
});
