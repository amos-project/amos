/*
 * @since 2024-10-24 16:26:50
 * @author junbao <junbao@moego.pet>
 */

import ts, { ModuleKind, ScriptTarget } from 'typescript';
import { createAmosTransformer } from './transformer';

const transform = (input: string) => {
  return ts.transpileModule(input, {
    compilerOptions: {
      module: ModuleKind.ESNext,
      target: ScriptTarget.ESNext,
    },
    transformers: {
      before: [createAmosTransformer(void 0)],
    },
  }).outputText;
};

describe('typescript plugin', () => {
  it('should add type', () => {
    expect(transform('export const foo = action(() => null)')).toEqual(
      `export const foo = action(() => null, { type: "foo" });\n`,
    );
    expect(transform('export const foo = foo.action(() => null)')).toEqual(
      `export const foo = foo.action(() => null, { type: "foo" });\n`,
    );
    expect(transform('export const foo = action(() => null, { type: `my type` })')).toEqual(
      `export const foo = action(() => null, Object.assign({ type: "foo" }, { type: \`my type\` }));\n`,
    );
    expect(transform('export const foo = foo.selector(() => null, { type: `my type` })')).toEqual(
      `export const foo = foo.selector(() => null, Object.assign({ type: "foo" }, { type: \`my type\` }));\n`,
    );
    expect(transform('export const foo = foo.selector1(() => null, { debug: "" })')).toEqual(
      `export const foo = foo.selector1(() => null, { debug: "" });\n`,
    );
  });
});
