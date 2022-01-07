/*
 * @since 2020-12-03 11:42:27
 * @author acrazing <joking.young@gmail.com>
 */

import { IDOf, isArray, Pair } from 'amos-utils';
import { List } from './List';
import { Map } from './Map';

export class ListMap<K, V, L extends List<V> = List<V>> extends Map<K, L> {
  constructor(
    readonly inferKey: K,
    readonly inferValue: V,
    readonly ListConstructor: new (items: readonly V[]) => L = List as any,
  ) {
    super(new ListConstructor([]), inferKey);
  }

  override set(key: IDOf<K>, value: L): this;
  override set(key: IDOf<K>, items: readonly V[]): this;
  override set(key: any, value: any): this {
    value = isArray(value) ? new this.ListConstructor(value) : value;
    return super.set(key, value);
  }

  override setAll(items: readonly Pair<IDOf<K>, L>[]): this;
  override setAll(items: readonly Pair<IDOf<K>, readonly V[]>[]): this;
  override setAll(items: any[]): this {
    if (isArray(items[0][1])) {
      items.forEach((item) => (item[1] = new this.ListConstructor(item[1])));
    }
    return super.setAll(items);
  }
}
