/*
 * @since 2020-11-28 10:29:02
 * @author acrazing <joking.young@gmail.com>
 */

import { dispatch, select } from 'amos-testing';
import { createBoxFactory } from './createBoxFactory';

class Foo<T> {
  constructor(public data: T) {}

  set(data: T): this {
    this.data = data;
    return this;
  }

  setField<K extends keyof T>(key: K, value: T[K]): this {
    this.data[key] = value;
    return this;
  }

  get() {
    return this;
  }

  getData(): T {
    return this.data;
  }

  getField<K extends keyof T>(key: K): T[K] {
    return this.data[key];
  }
}

const createFooBox = createBoxFactory(Foo, {
  mutations: { set: true, setField: true },
  selectors: { get: true, getData: true, getField: true },
});
const fooBox = createFooBox('unit.boxFactory.foo', new Foo({ foo: 'bar', bar: 1 }));

describe('createBoxFactory', () => {
  it('should create box factory', () => {
    select(fooBox.getData()).foo.substr(1, 2);
    // @ts-expect-error
    select(fooBox.getData()).baz;
    dispatch(fooBox.set({ foo: 'baz', bar: 2 }));
  });
});
