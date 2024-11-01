/*
 * @since 2024-10-24 10:56:38
 * @author junbao <junbao@moego.pet>
 */

import { $amos, createAmosObject, isAmosObject } from './object';

describe('object utils', () => {
  it('should create amos object', () => {
    expect($amos).toEqual(expect.any(Symbol));
    expect($amos).not.toEqual(expect.any(Object));
    const o1 = createAmosObject<any>('o1', { key: 'k1', type: 't1' });
    expect(o1).toEqual({ [$amos]: 'o1', id: o1.id, key: 'k1', type: 't1' });
    const o2 = createAmosObject<any>('o2', { id: 'A', key: null, type: 't2' });
    expect(o2).toEqual({ type: 't2', [$amos]: 'o2', id: o2.id, key: o2.id });
    const o3 = createAmosObject<any>('o1', { type: 't3' });
    expect(o1.id).not.toEqual(o3.id);
  });
  it('should check is amos object', () => {
    const o1 = createAmosObject<any>('o1', { type: 'o1' });
    const o2 = createAmosObject<any>('o2', { type: 'o2' });
    const o3 = createAmosObject<any>('o1', { type: 'o3' });
    expect(isAmosObject(o1, 'o1')).toBe(true);
    expect(isAmosObject(o2, 'o2')).toBe(true);
    expect(isAmosObject(o3, 'o2')).toBe(false);
  });
});
