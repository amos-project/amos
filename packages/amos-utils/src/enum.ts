/*
 * @since 2022-01-06 18:21:52
 * @author junbao <junbao@moego.pet>
 */

import { ID } from './types';

export class Enum<K extends string, V extends ID, D> {
  private readonly values: V[];
  private readonly mapLabels: Record<V, D>;
  private readonly mapKeys: Record<V, K>;
  private readonly keys: K[];

  constructor(schema: Record<K, readonly [V, D]>) {
    this.mapLabels = {} as Record<V, D>;
    this.mapKeys = {} as Record<V, K>;
    this.values = [];
    this.keys = [];
    let isNum = false;
    for (const key in schema) {
      if (schema.hasOwnProperty(key)) {
        const [value, label] = schema[key];
        isNum = typeof value === 'number';
        this.mapLabels[value] = label;
        this.mapKeys[value] = key;
        this.values.push(value);
        this.keys.push(key);
      }
    }
    isNum && (this.values as number[]).sort((a, b) => a - b);
  }

  forEach(fn: (value: V, label: D, key: K, index: number, values: V[]) => void): void {
    this.values.forEach((value, index) =>
      fn(value, this.label(value), this.key(value), index, this.values),
    );
  }

  map<U>(fn: (value: V, label: D, key: K, index: number, values: V[]) => U): U[] {
    return this.values.map((value, index) =>
      fn(value, this.mapLabels[value], this.mapKeys[value], index, this.values),
    );
  }

  keyMap<U>(fn: (value: V, label: D, key: K, index: number, values: V[]) => U): Record<K, U> {
    const map = {} as Record<K, U>;
    this.values.forEach((value, index) => {
      map[this.mapKeys[value]] = fn(
        value,
        this.mapLabels[value],
        this.mapKeys[value],
        index,
        this.values,
      );
    });
    return map;
  }

  valueMap<U>(fn: (value: V, label: D, key: K, index: number, values: V[]) => U): Record<V, U> {
    const map = {} as Record<V, U>;
    this.values.forEach((value, index) => {
      map[value] = fn(value, this.mapLabels[value], this.mapKeys[value], index, this.values);
    });
    return map;
  }

  label(value: V): D {
    return this.mapLabels[value];
  }

  key(value: V): K {
    return this.mapKeys[value];
  }

  filter(fn: (value: V, label: D, key: K, index: number) => boolean): V[] {
    return this.values.filter((value, index) =>
      fn(value, this.label(value), this.key(value), index),
    );
  }
}

export type EnumOptions<K extends string, V extends ID, D> = Enum<K, V, D> & Record<K, V>;

export type EnumKeys<T extends EnumOptions<any, any, any>> =
  T extends EnumOptions<infer K, infer V, infer D> ? K : never;
export type EnumLabels<T extends EnumOptions<any, any, any>> =
  T extends EnumOptions<infer K, infer V, infer D> ? D : never;
export type EnumValues<T extends EnumOptions<any, any, any>> =
  T extends EnumOptions<infer K, infer V, infer D> ? V : never;

/**
 * create an enum instance with strict value type
 * @param schema
 */
export function createStrictEnum<K extends string, V extends ID, D>(
  schema: Record<K, readonly [V, D]>,
): EnumOptions<K, V, D> {
  const e = new Enum(schema as Record<K, readonly [V, D]>) as EnumOptions<K, V, D>;
  e.forEach((value, label, key) => ((e as any)[key] = value));
  return e;
}

/**
 * create an enum instance with loose value type
 * @param schema
 */
export const createEnum: <K extends string, V, D>(
  schema: Record<K, readonly [V, D]>,
) => EnumOptions<K, V & ID, D> = createStrictEnum as any;
