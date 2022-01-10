/*
 * @since 2020-11-28 10:29:02
 * @author acrazing <joking.young@gmail.com>
 */

import { dispatch, select } from 'amos-testing';
import { Mutation } from './box';
import { BoxWithStateMethods, createBoxFactory } from './createBoxFactory';
import { Selector } from './selector';

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
    return this.data;
  }

  getField<K extends keyof T>(key: K): T[K] {
    return this.data[key];
  }
}

type FooBox<F extends Foo<any>> = BoxWithStateMethods<F, 'set', 'get'> & {
  /** @see {Foo#setField} */
  setField<K extends keyof F['data']>(key: K, value: F['data'][K]): Mutation<[K, F['data'][K]], F>;
  /** @see {Foo#getField} */
  getField<K extends keyof F['data']>(key: K): Selector<[K], F['data'][K]>;
};

const FooBox = createBoxFactory<FooBox<Foo<any>>>({
  mutations: { set: null, setField: null },
  selectors: { get: null, getField: null },
});

function createFooBox<T>(key: string, data: T): FooBox<Foo<T>> {
  return new FooBox(key, new Foo(data));
}

const fooBox = createFooBox('unit.boxFactory.foo', { foo: 'bar', bar: 1 });

class Bar<T, U> extends Foo<T> {
  constructor(data: T, public bar: U) {
    super(data);
  }

  getBar() {
    return this.bar;
  }

  getBarField<K extends keyof U>(key: K): U[K] {
    return this.bar[key];
  }

  setBar(bar: U): this {
    this.bar = bar;
    return this;
  }

  setBarField<K extends keyof U>(key: K, value: U[K]): this {
    this.bar[key] = value;
    return this;
  }
}

type BarBox<B extends Bar<any, any>> = BoxWithStateMethods<B, 'setBar', 'getBar', FooBox<B>> & {
  /** @see {Bar#setBarField} */
  setBarField<K extends keyof B['bar']>(key: K, value: B['bar'][K]): Mutation<[K, B['bar'][K]], B>;
  /** @see {Bar#getBarField} */
  getBarField<K extends keyof B['bar']>(key: K): Selector<[K], B['bar'][K]>;
};

const BarBox = FooBox.extends<BarBox<any>>({
  mutations: { setBarField: null, setBar: null },
  selectors: { getBarField: null, getBar: null },
});

function createBarBox<T, U>(key: string, data: T, bar: U): BarBox<Bar<T, U>> {
  return new BarBox(key, new Bar(data, bar));
}

const barBox = createBarBox('unit.boxFactory.bar', { foo: 'bar', bar: 1 }, { baz: true });

describe('createBoxFactory', () => {
  it('should create box factory', () => {
    select(fooBox.get()).foo.substr(1, 2);
    // @ts-expect-error
    select(fooBox.get()).baz?.valueOf();
    select(fooBox.getField('bar')).toExponential();
    // @ts-expect-error
    select(fooBox.getField('foo')).toExponential();

    dispatch(fooBox.set({ foo: 'baz', bar: 2 }));
    // @ts-expect-error
    dispatch(fooBox.set({ foo: 'baz', bar: 2, baz: true }));
    dispatch(fooBox.setField('bar', 1));
    // @ts-expect-error
    dispatch(fooBox.setField('foo', 2));
  });

  it('should should extends box factory', function () {
    select(barBox.get()).foo.substr(1, 2);
    // @ts-expect-error
    select(barBox.get()).baz?.valueOf();
    select(barBox.getField('bar')).toExponential();
    // @ts-expect-error
    select(barBox.getField('foo')).toExponential();
    select(barBox.getBar()).baz.valueOf();
    // @ts-expect-error
    select(barBox.getBar()).pal?.valueOf();
    select(barBox.getBarField('baz')).valueOf();
    // @ts-expect-error
    select(barBox.getBarField('pal'));

    dispatch(barBox.set({ foo: 'baz', bar: 2 })).getBarField('baz');
    // @ts-expect-error
    dispatch(barBox.set({ foo: 'baz', bar: 2, baz: true })).getBarField('baz');
    dispatch(barBox.setField('bar', 1)).getBarField('baz');
    // @ts-expect-error
    dispatch(barBox.setField('foo', 2)).getBarField('baz');
    dispatch(barBox.setBar({ baz: false })).getBarField('baz');
    // @ts-expect-error
    dispatch(barBox.setBar({ pal: false })).getBarField('baz');
    dispatch(barBox.setBarField('baz', true)).getBarField('baz');
    // @ts-expect-error
    dispatch(barBox.setBarField('pal', true)).getBarField('baz');
  });
});
