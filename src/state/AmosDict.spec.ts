/*
 * @since 2020-11-28 10:30:34
 * @author acrazing <joking.young@gmail.com>
 */

import { identity } from '..';
import { UserModel } from '../core/box.spec';
import { clone } from '../core/utils';
import { AmosDict, createDictBox } from './AmosDict';

describe('AmosDict', () => {
  it('should create dict', () => {
    const dict = new AmosDict(0 as number, new UserModel());
    dict.toJSON();
    dict.fromJSON({ 1: { id: 1 } as UserModel });
    dict.size();
    dict.setItem(2, new UserModel().merge({ id: 2 }));
    dict.mergeItem(3, { id: 3 });
    dict.setItems([[4, new UserModel().merge({ id: 4 })]]);
    dict.mergeItems([[5, { id: 5 }]]);
    dict.update(6, (v) => v.merge({ id: 6 }));
    dict.delete(7);
    dict.get(8);
    dict.take(9);
    dict.has(10);
    dict.keys();
    dict.values();
    dict.entities();
    dict.map(identity);
  });

  it('should create dict box factory', () => {
    const box = createDictBox('test/dict', new AmosDict(0 as number, new UserModel()));
    box.delete(1);
    box.update(2, (v) => clone(v, { id: 3 }));
    box.mergeItems([[4, { id: 5 }]]);
    box.setItems([[6, new UserModel()]]);
    box.mergeItem(7, { id: 8 });
    box.setItem(9, new UserModel());

    box.map(identity);
    box.entities();
    box.values();
    box.keys();
    box.has(10);
    box.take(11);
    box.get(12);
  });
});
