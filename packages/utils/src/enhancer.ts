/*
 * @since 2022-01-06 18:58:06
 * @author junbao <junbao@moego.pet>
 */

export type Enhancer<M> = (prev: M) => M;

export function applyEnhancers<M>(model: M, enhancers: Enhancer<M>[]): M {
  return enhancers.reduce((prev, now) => now(prev), model);
}

export function override<T, K extends keyof T>(obj: T, key: K, override: (original: T[K]) => T[K]) {
  const original = obj[key];
  obj[key] = override(original);
  return obj;
}
