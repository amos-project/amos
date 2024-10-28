/*
 * @since 2024-10-24 14:09:53
 * @author junbao <junbao@moego.pet>
 */

import { formatType, TransformerOptions } from 'amos-utils';
import ts from 'typescript';

function visitAmos(node: ts.Node, options: Required<TransformerOptions>) {
  if (!ts.isVariableDeclaration(node) || !ts.isIdentifier(node.name)) {
    return node;
  }

  const findCallExpression = <T extends ts.Expression | undefined>(expr: T): T => {
    if (!expr) {
      return void 0 as T;
    }
    const ifNotEqual = <U extends ts.Expression | undefined>(
      n: U,
      fn: (n: U) => ts.Expression,
    ): T => {
      const u = findCallExpression(n);
      if (u === n) {
        return expr;
      }
      return fn(u) as T;
    };

    if (ts.isAsExpression(expr)) {
      return ifNotEqual(expr.expression, (e) => {
        return ts.factory.createAsExpression(e, expr.type);
      });
    }

    if (ts.isParenthesizedExpression(expr)) {
      return ifNotEqual(expr.expression, (e) => {
        return ts.factory.createParenthesizedExpression(e);
      });
    }

    if (!ts.isCallExpression(expr)) {
      return expr;
    }

    const identifier = ts.isIdentifier(expr.expression)
      ? expr.expression
      : ts.isPropertyAccessExpression(expr.expression) && ts.isIdentifier(expr.expression.name)
        ? expr.expression.name
        : void 0;
    if (!identifier) {
      return expr;
    }

    if (!['action', 'selector'].includes(identifier.escapedText as string)) {
      return expr;
    }

    if (expr.arguments.length < 1 || expr.arguments.length > 2) {
      return expr;
    }

    const arg2 = expr.arguments[1];
    const name = (node.name as ts.Identifier).text;
    const args = expr.arguments.slice();
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
    args[1] = addType();
    return ts.factory.createCallExpression(expr.expression, expr.typeArguments, args) as any;
  };

  const expr = findCallExpression(node.initializer);
  if (expr === node.initializer) {
    return node;
  }
  return ts.factory.createVariableDeclaration(node.name, node.exclamationToken, node.type, expr);
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
