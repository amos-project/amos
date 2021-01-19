/*
 * @since 2020-12-03 11:42:27
 * @author acrazing <joking.young@gmail.com>
 */

import { KcatsDict, createDictBox, DictKey } from './KcatsDict';
import { KcatsList } from './KcatsList';

export class KcatsListDict<K extends DictKey, T> extends KcatsDict<K, KcatsList<T>> {
  constructor(items?: T[], inferKey?: K) {
    super(new KcatsList<T>(items), inferKey);
  }

  setList(key: K, items: T[]): this {
    return this.setItem(key, new KcatsList<T>(items));
  }

  setLists(items: readonly (readonly [K, T[]])[]): this {
    return this.setItems(items.map(([key, items]) => [key, new KcatsList<T>(items)]));
  }
}

export const createListDictBox = createDictBox.extend(
  KcatsListDict,
  { setList: true, setLists: true },
  {},
);
