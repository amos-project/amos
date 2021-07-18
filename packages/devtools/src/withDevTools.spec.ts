/*
 * @since 2020-11-15 23:17:01
 * @author acrazing <joking.young@gmail.com>
 */

import { createStore, Store, StoreEnhancer } from 'amos';
import { forceWithDevTools, withDevTools } from './withDevTools';

describe('withDevTools', () => {
  it('should works', () => {
    const shouldEnhanced = (enhanced: boolean, enhancer: StoreEnhancer) => {
      const store = createStore(void 0, enhancer);
      const pp: Store = Object.getPrototypeOf(Object.getPrototypeOf(store));
      expect(pp.dispatch === store.dispatch).toBe(!enhanced);
      expect(pp.select === store.select).toBe(!enhanced);
      expect(pp.snapshot === store.snapshot).toBe(true);
      expect(pp.subscribe === store.subscribe).toBe(true);
    };
    const forceEnv = (NODE_ENV: string) => {
      if (typeof process === 'object') {
        process.env.NODE_ENV = NODE_ENV;
      } else {
        Object.assign(globalThis, { process: { env: { NODE_ENV } } });
      }
    };
    const forceExt = (ok: boolean) => {
      if (ok) {
        Object.assign(globalThis, {
          __REDUX_DEVTOOLS_EXTENSION__: {
            connect: () => ({
              init() {},
              send() {},
            }),
          },
        });
      } else {
        Object.assign(globalThis, { __REDUX_DEVTOOLS_EXTENSION__: void 0 });
      }
    };
    forceEnv('development');
    forceExt(true);
    shouldEnhanced(true, withDevTools());
    forceExt(false);
    shouldEnhanced(false, withDevTools());
    forceEnv('production');
    forceExt(true);
    shouldEnhanced(false, withDevTools());
    shouldEnhanced(true, forceWithDevTools());
    shouldEnhanced(false, forceWithDevTools({ disable: true }));
  });
});
