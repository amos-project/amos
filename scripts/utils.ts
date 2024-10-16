/*
 * @since 2024-10-16 14:07:31
 * @author junbao <junbao@moego.pet>
 */

export const autorun = <A extends any[], R>(
  module: NodeModule,
  args: () => A,
  fn: (...args: A) => R,
): ((...args: A) => R) => {
  if (require.main === module) {
    Promise.resolve(args()).then((args) => fn(...args));
  }
  return fn;
};
