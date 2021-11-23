/*
 * @since 2020-11-30 13:52:50
 * @author acrazing <joking.young@gmail.com>
 */

import { UserModel } from 'amos-testing';
import { RecordDict, createRecordDictBox } from './RecordDict';

describe('AmosRecordDict', () => {
  it('should create record dict', () => {
    const dict = new RecordDict(new UserModel(), 'id');
    dict.toJSON();
    dict.fromJSON({ 1: { id: 1 } as UserModel });
    dict.setRecords([new UserModel().merge({ id: 2 })]);
    dict.mergeRecords([{ id: 3 }]);
  });

  it('should create record dict box', () => {
    const box = createRecordDictBox('test/recordDict', new RecordDict(new UserModel(), 'id'));

    box.setRecords([new UserModel()]);
    box.mergeRecords([{ id: 1 }]);
    box.mergeItem(2, { id: 3 });
    box.get(4);
  });
});
