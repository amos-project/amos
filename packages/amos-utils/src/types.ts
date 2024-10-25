/*
 * @since 2022-01-06 18:24:22
 * @author junbao <junbao@moego.pet>
 */

export type ID = number | string;
export type IDOf<T> = T & ID;
export type IDKeyof<T, K = ID> = { [P in keyof T]-?: T[P] extends K ? P : never }[keyof T];

export type Subscribe = () => void;
export type Unsubscribe = () => void;

// see {@link https://stackoverflow.com/a/50375286/4380247}
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

export type Replace<A, B> = Omit<A, keyof B> & B;

export type ValueOrFunc<T, A extends any[] = []> = T | ((...args: A) => T);
export type ValueOrConstructor<T, A extends any[] = []> = T | (new (...args: A) => T);
export type Constructor<T, A extends any[] = []> = new (...args: A) => T;
export type ValueOrReadonlyArray<T> = T | readonly T[];
export type ValueOrArray<T> = T | T[];
export type ValueOrPromise<T> = T | Promise<T>;

export type ToString<T> = T extends string
  ? T
  : T extends {
        toString(): infer U;
      }
    ? U extends string
      ? U
      : string
    : string;

export type PartialRecord<K extends keyof any, V> = { [P in K]+?: V };

export type PartialDictionary<K extends keyof any, V> = PartialRecord<K, V> & {
  // Force no array
  readonly [Symbol.iterator]?: unique symbol;
};

export type PartialRequired<T, K extends keyof T> = Required<Pick<T, K>> & Partial<Omit<T, K>>;
export type Entry<K, V> = readonly [K, V];

export type PrimitiveOf<T> = Exclude<T, object>;

export type WellPartial<T> = T extends object ? Partial<T> : T;

export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export type AnyFunc = (...args: any[]) => any;

export type FuncParams<T> =
  IsAny<T> extends true ? any[] : T extends (...args: infer A) => infer R ? A : never;
export type FuncReturn<T> =
  IsAny<T> extends true ? any : T extends (...args: infer A) => infer R ? R : never;

export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

export type IsNever<T> = [T] extends [never] ? true : false;
export type MustNever<T extends never> = T;

export type IsAny<T> = 0 extends 1 & T ? true : false;
export type IsUnknown<T> = unknown extends T ? (T extends unknown ? true : false) : false;

export type OmitKeys<T, K extends keyof T> = Omit<T, K>;
