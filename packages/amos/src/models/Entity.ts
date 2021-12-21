/*
 * @since 2021-10-25 17:21:47
 * @author junbao <junbao@mymoement.com>
 */

import { clone, createBoxFactory } from 'amos-amos';
import { JSONState } from '../core/types';

export interface EntityProto<P extends object> {
  get<K extends keyof P>(key: K): P[K];
  set<K extends keyof P>(key: K, value: P[K]): this;
  merge(props: Partial<P>): this;
  update<K extends keyof P>(key: K, updater: (value: P[K]) => P[K]): this;
  toJSON(): P;
  fromJSON(props: JSONState<P>): this;
  isValid(): boolean;
}

export type EntityInstance<P extends object> = Readonly<P> & EntityProto<P>;

export type EntityProps<T> = T extends EntityInstance<infer P> ? P : T;
export type PartialRequired<T, K extends keyof T> = Required<Pick<T, K>> & Partial<Omit<T, K>>;
export type PartialProps<T> = Partial<EntityProps<T>>;
export type PartialRequiredProps<T, K extends keyof EntityProps<T>> = PartialRequired<
  EntityProps<T>,
  K
>;

export interface EntityConstructor<P extends object> {
  create<P, R>(this: new (props?: P, isValid?: boolean) => R, props?: P): R;
  new (props?: Partial<P>, isValid?: boolean): EntityInstance<P>;
}

export function Entity<P extends object>(props: P): EntityConstructor<P> {
  return class Entity implements EntityProto<P> {
    private _isInvalid!: boolean;

    constructor(data?: Partial<P>, isValid?: boolean) {
      Object.assign(this, props, data);
      Object.defineProperty(this, '_isInvalid', { value: !isValid });
    }

    static create<P, R>(this: new (props?: P, isValid?: boolean) => R, props?: P): R {
      return new this(props, true);
    }

    toJSON(): P {
      return { ...this } as any;
    }

    fromJSON(data: JSONState<P>) {
      const that: any = clone(this, {});
      for (const k in data) {
        if (that[k]?.fromJSON) {
          that[k] = that[k].fromJSON(data[k]);
        } else {
          that[k] = data[k];
        }
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
      return clone(this, { [key]: value } as unknown as Partial<this>);
    }

    merge(props: Partial<P>): this {
      return clone(this, props as any);
    }

    update<K extends keyof P>(key: K, updater: (value: P[K]) => P[K]): this {
      return this.set(key, updater(this.get(key)));
    }

    isValid(): boolean {
      return !this._isInvalid;
    }
  } as any;
}

export const createEntityBox = createBoxFactory(Entity({}), {
  mutations: {
    set: true,
    update: true,
    merge: true,
  },
  selectors: {
    get: {},
  },
});

export const EntityObject: <T extends object>(props: T) => new () => {} = Entity;
