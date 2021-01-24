/*
 * @since 2020-11-30 13:52:50
 * @author acrazing <joking.young@gmail.com>
 */

import { clone } from '@kcats/core';
import { Dict, createDictBox, DictKey } from './Dict';
import { fork, forkable } from './utils';

@forkable
export class RecordDict<KF extends DictKey, V extends { readonly [P in KF]: DictKey }> extends Dict<
  V[KF],
  V
> {
  constructor(readonly defaultValue: V, readonly keyField: KF) {
    super(defaultValue, defaultValue[keyField] as V[KF]);
  }

  setRecords(items: readonly V[]) {
    items.forEach((item) => {
      this.data[item[this.keyField] as V[KF]] = item;
    });
    return fork(this);
  }

  mergeRecords(items: readonly (Partial<Omit<V, KF>> & Pick<V, KF>)[]) {
    items.forEach((item) => {
      this.data[item[this.keyField] as V[KF]] = clone(
        this.data[item[this.keyField] as V[KF]] ?? this.defaultValue,
        item as Partial<V>,
      );
    });
    return fork(this);
  }
}

export const createRecordDictBox = createDictBox.extend(
  RecordDict,
  {
    setRecords: true,
    mergeRecords: true,
  },
  {},
);
