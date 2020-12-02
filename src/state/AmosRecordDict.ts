/*
 * @since 2020-11-30 13:52:50
 * @author acrazing <joking.young@gmail.com>
 */

import { clone } from '../core/utils';
import { AmosDict, createDictBox, DictKey } from './AmosDict';
import { fork, forkable } from './utils';

@forkable
export class AmosRecordDict<
  KF extends DictKey,
  V extends { readonly [P in KF]: DictKey }
> extends AmosDict<V[KF], V> {
  constructor(protected readonly defaultValue: V, protected readonly keyField: KF) {
    super(defaultValue[keyField] as V[KF] & DictKey, defaultValue);
  }

  setRecords(items: readonly V[]) {
    items.forEach((item) => {
      this.data[item[this.keyField] as V[KF] & DictKey] = item;
    });
    return fork(this);
  }

  mergeRecords(items: readonly (Partial<Omit<V, KF>> & Pick<V, KF>)[]) {
    items.forEach((item) => {
      this.data[item[this.keyField] as V[KF] & DictKey] = clone(
        this.data[item[this.keyField] as V[KF] & DictKey] ?? this.defaultValue,
        item as Partial<V>,
      );
    });
    return fork(this);
  }
}

export const createRecordDictBox = createDictBox.extend(
  AmosRecordDict,
  ['setRecords', 'mergeRecords'] as const,
  [] as const,
);
