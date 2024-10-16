/*
 * @since 2021-10-25 17:21:47
 * @author junbao <junbao@mymoement.com>
 */

import {
  clone,
  Cloneable,
  fromJS,
  JSONSerializable,
  JSONState,
  PartialRequired,
  WellPartial,
} from 'amos-utils';

export interface IRecord<P extends object> extends Cloneable, JSONSerializable<P> {
  get<K extends keyof P>(key: K): P[K];
  set<K extends keyof P>(key: K, value: P[K]): this;
  merge(props: Partial<P>): this;
  update<K extends keyof P>(key: K, updater: (value: P[K]) => P[K]): this;
}

export type Record<P extends object> = Readonly<P> & IRecord<P>;

export type RecordProps<T> = T extends Record<infer P> ? P : T;
export type PartialProps<T> = WellPartial<RecordProps<T>>;
export type PartialRequiredProps<T, K extends keyof RecordProps<T>> = PartialRequired<
  RecordProps<T>,
  K
>;

export interface RecordConstructor<P extends object> {
  new (props?: Partial<P>, isValid?: boolean): Record<P>;
}

export function Record<P extends object>(props: P): RecordConstructor<P> {
  return class Record extends Cloneable implements IRecord<P> {
    constructor(data?: Partial<P>, isValid = data !== void 0) {
      super(isValid);
      Object.assign(this, props, data);
    }

    toJSON(): P {
      return { ...this } as unknown as P;
    }

    fromJS(data: JSONState<P>) {
      const that: any = clone(this, props as any);
      for (const k in data) {
        that[k] = fromJS(that[k], data[k]);
      }
      return that;
    }

    get<K extends keyof P>(key: K): P[K] {
      return (this as any)[key];
    }

    set<K extends keyof P>(key: K, value: P[K]): this {
      if (this.get(key) === value) {
        return this;
      }
      return clone(this, { [key]: value } as unknown as WellPartial<this>);
    }

    merge(props: Partial<P>): this {
      for (const key in props) {
        if (props[key] !== this.get(key)) {
          return clone(this, props as any);
        }
      }
      return this;
    }

    update<K extends keyof P>(key: K, updater: (value: P[K]) => P[K]): this {
      return this.set(key, updater(this.get(key)));
    }
  } as any;
}

export const RecordObject: <T extends object>(props: T) => new () => {} = Record;
