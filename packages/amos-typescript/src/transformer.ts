/*
 * @since 2024-10-24 14:09:53
 * @author junbao <junbao@moego.pet>
 */

import { formatType, TransformerOptions } from 'amos-utils';
import ts from 'typescript';

function visitAmos(node: ts.Node, options: Required<TransformerOptions>) {
  if (
    !ts.isVariableDeclaration(node) ||
    !ts.isIdentifier(node.name) ||
    !node.initializer ||
    !ts.isCallExpression(node.initializer)
  ) {
    return node;
  }
  const identifier = ts.isIdentifier(node.initializer.expression)
    ? node.initializer.expression
    : ts.isPropertyAccessExpression(node.initializer.expression) &&
        ts.isIdentifier(node.initializer.expression.name)
      ? node.initializer.expression.name
      : void 0;
  if (!identifier) {
    return node;
  }
  if (node.initializer.arguments.length < 1 || node.initializer.arguments.length > 2) {
    return node;
  }
  const arg2 = node.initializer.arguments[1];
  const name = node.name.text;
  const args = node.initializer.arguments.slice();
  const addType = () => {
    const type = options.prefix + formatType(name, options.format);
    const obj = ts.factory.createObjectLiteralExpression([
      ts.factory.createPropertyAssignment('type', ts.factory.createStringLiteral(type)),
    ]);
    if (!arg2) {
      return obj;
    }
    return ts.factory.createCallExpression(
      ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('Object'), 'assign'),
      void 0,
      [obj, arg2],
    );
  };
  if (['action', 'selector'].includes(identifier.escapedText as string)) {
    args[1] = addType();
    return ts.factory.createVariableDeclaration(
      node.name,
      void 0,
      void 0,
      ts.factory.createCallExpression(
        node.initializer.expression,
        node.initializer.typeArguments,
        args,
      ),
    );
  }
  return node;
}

export function createAmosTransformer(
  program: ts.Program | undefined,
  options?: TransformerOptions,
): ts.TransformerFactory<ts.SourceFile> {
  const fullOptions: Required<TransformerOptions> = {
    prefix: '',
    format: 'original',
    ...options,
  };
  return (context) => {
    return (source) => {
      const visitor: ts.Visitor = (node) => {
        const newNode = visitAmos(node, fullOptions);
        return newNode === node ? ts.visitEachChild(node, visitor, context) : newNode;
      };
      return ts.visitEachChild(source, visitor, context);
    };
  };
}
