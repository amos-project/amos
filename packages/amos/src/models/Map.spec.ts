/*
 * @since 2020-11-28 10:30:34
 * @author acrazing <joking.young@gmail.com>
 */

import { Beth, idCompare, Jerry, Jessica, Morty, Rick, UserEntity } from './Entity.spec';
import { createMapBox, Map } from './Map';

export const UserModelMap = createMapBox('User.modelMap', Map.num(new UserEntity()));

describe('AmosDict', () => {
  it('should create Map', () => {
    let dict = new Map(new UserEntity(), 0 as number);
    dict.toJSON();
    dict = dict.fromJSON({ [Rick.id]: Rick.toJSON() });
    dict.size();
    dict = dict.set(Morty.id, Morty);
    dict = dict.merge(Jerry.id, Jerry.toJSON());
    dict = dict.setAll([[Jessica.id, Jessica]]);
    dict = dict.mergeAll([[Beth.id, Beth.toJSON()]]);
    dict = dict.update(Rick.id, (v) => v.set('firstName', v.firstName.repeat(2)));
    expect(dict.toJSON()).toEqual({
      [Rick.id]: Rick,
      [Morty.id]: Morty,
      [Jessica.id]: Jerry,
      [Jerry.id]: Jerry,
      [Beth.id]: Beth,
    });
    dict = dict.delete(Jerry.id);
    expect(dict.has(Jerry.id)).toBeFalsy();
    expect(dict.get(Morty.id)).toEqual(Morty);
    expect(dict.has(Morty.id)).toBeTruthy();
    expect(dict.keys().sort()).toEqual([Rick.id, Morty.id, Jessica.id, Beth.id].sort());
    expect(dict.values().sort(idCompare)).toEqual([Rick, Morty, Jerry, Beth].sort(idCompare));
    expect(dict.entities().sort(([a], [b]) => +a - +b)).toEqual(
      [Rick, Morty, Jerry, Beth].sort(idCompare).map((a) => [a.id + '', a]),
    );
  });

  it('should create MapBox', () => {
    UserModelMap.delete(1);
    UserModelMap.update(Jerry.id, () => Jerry);
    UserModelMap.set(Jerry.id, Jerry);
    UserModelMap.merge(Jerry.id, Jerry.toJSON());
    UserModelMap.mergeAll([[Jerry.id, Jerry.toJSON()]]);
    UserModelMap.setAll([[Jerry.id, Jerry]]);

    UserModelMap.get(Jerry.id);
    UserModelMap.has(Jerry.id);
    UserModelMap.keys();
    UserModelMap.values();
    UserModelMap.entities();
  });
});
