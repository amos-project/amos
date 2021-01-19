/*
 * @since 2020-11-16 22:03:04
 * @author acrazing <joking.young@gmail.com>
 */

import ts from 'typescript';
import { createKcatsTransformer } from './createKcatsTransformer';

const cases: Record<string, { from: string; to?: string }> = {
  'action - arrow': {
    from: `export const arrowAction = action(() => void 0)`,
    to: `export const arrowAction = action(() => void 0, "arrow_action");`,
  },
  'mutation - arrow': {
    from: `export const arrowMutation = mutation(() => void 0)`,
    to: `export const arrowMutation = mutation(() => void 0, "arrow_mutation");`,
  },
  'select - arrow': {
    from: `export const selectArrowState = selector(() => void 0)`,
    to: `export const selectArrowState = selector(() => void 0, undefined, undefined, "arrowState");`,
  },
  'action - arrow property': {
    from: `export const arrowAction = box.action(() => void 0)`,
    to: `export const arrowAction = box.action(() => void 0, "arrow_action");`,
  },
  'mutation - arrow property': {
    from: `export const arrowMutation = box.mutation(() => void 0)`,
    to: `export const arrowMutation = box.mutation(() => void 0, "arrow_mutation");`,
  },
  'select - arrow property': {
    from: `export const selectArrowState = box.selector(() => void 0)`,
    to: `export const selectArrowState = box.selector(() => void 0, undefined, undefined, "arrowState");`,
  },
};

describe('createKcatsTransformer', () => {
  for (const key in cases) {
    it(`should transform ${key}`, () => {
      const { from, to = from } = cases[key];
      const result = ts.transpileModule(from, {
        compilerOptions: {
          target: ts.ScriptTarget.ESNext,
        },
        reportDiagnostics: true,
        transformers: {
          before: [createKcatsTransformer(void 0)],
        },
      });
      expect(result.diagnostics?.length).toBe(0);
      expect(result.outputText.trim()).toBe(to.trim());
    });
  }
});
