/*
 * @since 2022-01-08 10:38:25
 * @author junbao <junbao@moego.pet>
 */

import { OMap } from './OMap';

describe('OMap', function () {
  it('should create OMap', function () {
    const map = new OMap([[0, 0]]);
    expect({
      initSize: map.size(),
      initHas0: map.hasItem(0),
      initHas1: map.hasItem(1),
      initGet0: map.getItem(0),
      initGet1: map.getItem(1),
      initTake0: map.takeItem(0),
      set1: map.setItem(1, 2),
      get1: map.getItem(1),
      get0: map.getItem(0),
      size: map.size(),
      clear: map.clear(),
      clearSize: map.size(),
      clearGet: map.getItem(0),
    }).toEqual({
      initSize: 1,
      initHas0: true,
      initHas1: false,
      initGet0: 0,
      initGet1: void 0,
      initTake0: 0,
      set1: map,
      get1: 2,
      get0: 0,
      size: 2,
      clear: map,
      clearSize: 0,
      clearGet: void 0,
    });
    expect(() => map.takeItem(0)).toThrow();
  });
});
