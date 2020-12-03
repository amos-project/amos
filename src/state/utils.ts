/*
 * @since 2020-11-28 11:19:34
 * @author acrazing <joking.young@gmail.com>
 */

const FORKABLE_PROTO_KEY =
  typeof Symbol === 'function' ? Symbol('FORKABLE_PROTO') : 'Symbol(FORKABLE_PROTO)';

function isDied() {
  throw new Error('This object is died, please use the newest one instead.');
}

const {
  getOwnPropertyNames,
  getOwnPropertySymbols,
  getOwnPropertyDescriptor,
  defineProperty,
  setPrototypeOf,
  getPrototypeOf,
  create,
  assign,
} = Object;

function createForkProto(proto: any): any {
  const parent = getPrototypeOf(proto);
  const parentForkProto =
    !parent || parent === Object.prototype
      ? parent
      : parent.hasOwnProperty(FORKABLE_PROTO_KEY)
      ? parent[FORKABLE_PROTO_KEY]
      : createForkProto(parent);
  const forkProto = Object.create(parentForkProto);
  [...getOwnPropertyNames(proto), ...getOwnPropertySymbols?.(proto)].forEach((key) => {
    defineProperty(forkProto, key, { get: isDied });
  });
  defineProperty(proto, FORKABLE_PROTO_KEY, forkProto);
  return forkProto;
}

/**
 * mark a class as forkable, which means you can use `fork` to clone an instance of it.
 * @param clazz
 */
export function forkable(clazz: new (...args: any[]) => any): void {
  if (process.env.NODE_ENV === 'development') {
    createForkProto(clazz.prototype);
  }
}

/**
 * fork an object, the old one will be marked as died if the env is dev, and returns
 * an new shallow copied object.
 * @param obj
 */
export function fork<T>(obj: T): T {
  const newObj = create(getPrototypeOf(obj));
  assign(newObj, obj);
  if (process.env.NODE_ENV === 'development') {
    setPrototypeOf(obj, (obj as any)[FORKABLE_PROTO_KEY]);
    [...getOwnPropertyNames(obj), ...getOwnPropertySymbols?.(obj)].forEach((key) => {
      const desc = getOwnPropertyDescriptor(obj, key);
      if (desc?.configurable) {
        defineProperty(obj, key, { get: isDied });
      }
    });
  }
  return newObj;
}
