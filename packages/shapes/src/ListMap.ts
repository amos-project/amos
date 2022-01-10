/*
 * @since 2020-12-03 11:42:27
 * @author acrazing <joking.young@gmail.com>
 */

import { ID, isArray, Pair } from 'amos-utils';
import { List, ListElement } from './List';
import { Map } from './Map';

export class ListMap<K extends ID, L extends List<any>> extends Map<K, L> {
  override setItem(key: K, value: L): this;
  override setItem(key: K, items: readonly ListElement<L>[]): this;
  override setItem(key: any, value: any): this {
    return super.setItem(key, isArray(value) ? this.defaultValue.reset(value) : value);
  }

  override setAll(items: readonly Pair<K, L>[]): this;
  override setAll(items: readonly Pair<K, readonly ListElement<L>[]>[]): this;
  override setAll(items: any[]): this {
    if (isArray(items[0][1])) {
      items.forEach((item) => (item[1] = this.defaultValue.reset(item[1])));
    }
    return super.setAll(items);
  }
}
