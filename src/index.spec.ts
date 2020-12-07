/*
 * @since 2020-11-18 01:09:57
 * @author acrazing <joking.young@gmail.com>
 */

import * as amos from './index';
import {
  action,
  AmosDict,
  AmosList,
  AmosListDict,
  AmosRecordDict,
  arrayEqual,
  Box,
  clone,
  connect,
  Consumer,
  createBoxFactory,
  createDictBox,
  createListBox,
  createListDictBox,
  createRecordDictBox,
  createStore,
  fork,
  forkable,
  fromJSON,
  hoistMethod,
  identity,
  isAmosObject,
  isJSONSerializable,
  Provider,
  selector,
  shallowEqual,
  signal,
  useDispatch,
  useSelector,
  useStore,
  VERSION,
} from './index';

describe('amos', () => {
  it('should exports', () => {
    expect(amos).toEqual({
      createStore,
      Box,
      action,
      signal,
      selector,

      useStore,
      useDispatch,
      useSelector,
      Provider,
      Consumer,
      connect,

      identity,
      shallowEqual,
      hoistMethod,
      isAmosObject,
      arrayEqual,
      clone,
      isJSONSerializable,
      fromJSON,

      createBoxFactory,

      AmosDict,
      createDictBox,
      AmosList,
      createListBox,
      AmosListDict,
      createListDictBox,
      AmosRecordDict,
      createRecordDictBox,

      forkable,
      fork,

      VERSION,
    });
  });
});
