/*
 * @since 2024-10-24 15:19:43
 * @author junbao <junbao@moego.pet>
 */

import type { PluginObj } from '@babel/core';
import babel from '@babel/core';
import { formatType, TransformerOptions } from 'amos-utils';

export function amosBabelPlugin(
  { types: t }: typeof babel,
  { format = 'original', prefix = '' }: TransformerOptions,
): PluginObj {
  return {
    visitor: {
      VariableDeclarator(path) {
        if (!t.isIdentifier(path.node.id) || !t.isCallExpression(path.node.init)) {
          return;
        }
        const identifier = t.isMemberExpression(path.node.init.callee)
          ? path.node.init.callee.property
          : path.node.init.callee;
        if (!t.isIdentifier(identifier) || !['action', 'selector'].includes(identifier.name)) {
          return;
        }
        if (path.node.init.arguments.length > 2 || path.node.init.arguments.length < 1) {
          return;
        }
        const name = path.node.id.name;
        const arg2 = path.node.init.arguments[1];
        const addType = () => {
          const type = prefix + formatType(name, format);
          const obj = t.objectExpression([
            t.objectProperty(t.identifier('type'), t.stringLiteral(type)),
          ]);
          if (!arg2) {
            return obj;
          }
          return t.callExpression(
            t.memberExpression(t.identifier('Object'), t.identifier('assign')),
            [obj, arg2],
          );
        };
        path.node.init.arguments[1] = addType();
      },
    },
  };
}
