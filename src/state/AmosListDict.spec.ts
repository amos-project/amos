/*
 * @since 2020-12-03 11:42:27
 * @author acrazing <joking.young@gmail.com>
 */

import { AmosListDict, createListDictBox } from './AmosListDict';

describe('AmosListDict', () => {
  it('should create list dict', () => {
    const list = new AmosListDict<number, number>([0]);
    list.size();
    list.setList(1, [2]);
    list.setLists([[3, [4, 5]]]);
  });

  it('should create list box', () => {
    const list = createListDictBox('test/dict/list', new AmosListDict([0], 1 as number));
    list.size();
    list.setList(1, [2]);
    list.setLists([[3, [4, 5]]]);
  });
});
