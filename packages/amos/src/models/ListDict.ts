/*
 * @since 2020-12-03 11:42:27
 * @author acrazing <joking.young@gmail.com>
 */

import { Dict, createDictBox, DictKey } from './Dict';
import { List } from './List';

export class ListDict<K extends DictKey, T> extends Dict<K, List<T>> {
  constructor(items?: T[], inferKey?: K) {
    super(new List<T>(items), inferKey);
  }

  setList(key: K, items: T[]): this {
    return this.setItem(key, new List<T>(items));
  }

  setLists(items: readonly (readonly [K, T[]])[]): this {
    return this.setItems(items.map(([key, items]) => [key, new List<T>(items)]));
  }
}

export const createListDictBox = createDictBox.extend(
  ListDict,
  { setList: true, setLists: true },
  {},
);
