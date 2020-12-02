/*
 * @since 2020-11-28 10:30:34
 * @author acrazing <joking.young@gmail.com>
 */

import { UserModel } from '../core/box.spec';
import { AmosDict } from './AmosDict';

describe('AmosDict', () => {
  it('should setItem', () => {
    const dict = new AmosDict(0, new UserModel(), 'id');
    dict.setItem(1, new UserModel().merge({ id: 1 }));
  });
});
