/*
 * @since 2024-10-24 15:48:19
 * @author junbao <junbao@moego.pet>
 */

import * as babel from '@babel/core';
import { amosBabelPlugin } from './plugin';

const transform = (input: string) => {
  return babel.transform(input, {
    plugins: [amosBabelPlugin],
  })?.code;
};

describe('babel plugin', () => {
  it('should add type', () => {
    expect(transform('export const foo = action(null)')).toEqual(
      `
export const foo = action(null, {
  type: "foo"
});`.trim(),
    );
    expect(transform('export const foo = foo.action(null)')).toEqual(
      `
export const foo = foo.action(null, {
  type: "foo"
});`.trim(),
    );
    expect(transform('export const foo = action(null, { type: `my type` })')).toEqual(
      `
export const foo = action(null, Object.assign({
  type: "foo"
}, {
  type: \`my type\`
}));`.trim(),
    );
    expect(transform('export const foo = foo.selector(null, { type: `my type` })')).toEqual(
      `
export const foo = foo.selector(null, Object.assign({
  type: "foo"
}, {
  type: \`my type\`
}));`.trim(),
    );
    expect(transform('export const foo = foo.selector1(null, { debug: "" })')).toEqual(
      `
export const foo = foo.selector1(null, {
  debug: ""
});`.trim(),
    );
  });
});
