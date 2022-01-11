/*
 * @since 2022-01-06 18:24:22
 * @author junbao <junbao@moego.pet>
 */

export type ID = number | string;
export type IDOf<T> = T & ID;
export type IDKeyof<T> = { [P in keyof T]-?: T[P] extends ID ? P : never }[keyof T];

export type Subscribe = () => void;
export type Unsubscribe = () => void;

// see {@link https://stackoverflow.com/a/50375286/4380247}
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type Replace<A, B> = Omit<A, keyof B> & B;

export type FnValue<T, A extends any[] = []> = T | ((...args: A) => T);
export type CtorValue<T, A extends any[] = []> = T | (new (...args: A) => T);
export type Ctor<T, A extends any[] = []> = new (...args: A) => T;

export type ToString<T> = T extends string ? T : T extends { toString(): infer U } ? (U extends string ? U : string) : string;

export type PartialRecord<K extends keyof any, V> = { [P in K]+?: V };
export type PartialRequired<T, K extends keyof T> = Required<Pick<T, K>> & Partial<Omit<T, K>>;
export type Pair<K, V> = readonly [K, V];

export type PrimitiveOf<T> = T extends object ? never : T;

export type WellPartial<T> = T extends object ? Partial<T> : T;

export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export type AnyFn = (...args: any[]) => any;
