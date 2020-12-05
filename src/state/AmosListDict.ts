/*
 * @since 2020-12-03 11:42:27
 * @author acrazing <joking.young@gmail.com>
 */

import { AmosDict, createDictBox, DictKey } from './AmosDict';
import { AmosList } from './AmosList';

export class AmosListDict<K extends DictKey, T> extends AmosDict<K, AmosList<T>> {
  constructor(items?: T[], inferKey?: K) {
    super(new AmosList<T>(items), inferKey);
  }

  setList(key: K, items: T[]): this {
    return this.setItem(key, new AmosList<T>(items));
  }

  setLists(items: readonly (readonly [K, T[]])[]): this {
    return this.setItems(items.map(([key, items]) => [key, new AmosList<T>(items)]));
  }
}

export const createListDictBox = createDictBox.extend(
  AmosListDict,
  { setList: true, setLists: true },
  {},
);
