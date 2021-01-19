/*
 * @since 2020-11-16 22:03:04
 * @author acrazing <joking.young@gmail.com>
 */

import ts from 'typescript';

export type TypeFormat =
  | 'original'
  | 'lowerCamelCase'
  | 'UpperCamelCase'
  | 'lower_underscore'
  | 'UPPER_UNDERSCORE';

export interface KcatsTransformerOptions {
  recursive?: boolean;
  mutationPrefix?: string;
  actionPrefix?: string;
  selectorPrefix?: string;
  mutationFormat?: TypeFormat;
  actionFormat?: TypeFormat;
  selectorFormat?: TypeFormat;
  removeSelectPrefix?: boolean;
}

/** @internal */
export function formatType(type: string, format: TypeFormat) {
  switch (format) {
    case 'lower_underscore':
      return type.replace(/([A-Z]+)/g, ($0, $1) => '_' + $1.toLowerCase()).replace(/^_+/, '');
    case 'UPPER_UNDERSCORE':
      return type
        .replace(/([A-Z]+)/g, ($0, $1) => '_' + $1)
        .replace(/^_+/, '')
        .toUpperCase();
    case 'lowerCamelCase':
      return type
        .replace(/_(.)/g, ($0, $1) => $1.toUpperCase())
        .replace(/^./, ($0) => $0.toLowerCase());
    case 'UpperCamelCase':
      return type
        .replace(/_(.)/g, ($0, $1) => $1.toUpperCase())
        .replace(/^./, ($0) => $0.toUpperCase());
    default:
      return type;
  }
}

function visitKcats(node: ts.Node, options: Required<KcatsTransformerOptions>) {
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
  if (!ts.isFunctionLike(node.initializer.arguments[0])) {
    return node;
  }
  const args = node.initializer.arguments.slice();
  switch (identifier.escapedText) {
    case 'action': {
      if (node.initializer.arguments.length > 1) {
        return node;
      }
      const type = formatType(options.actionPrefix + node.name.text, options.actionFormat);
      args.push(ts.factory.createStringLiteral(type));
      break;
    }
    case 'mutation': {
      if (node.initializer.arguments.length > 1) {
        return node;
      }
      const type = formatType(options.mutationPrefix + node.name.text, options.mutationFormat);
      args.push(ts.factory.createStringLiteral(type));
      break;
    }
    case 'selector': {
      if (node.initializer.arguments.length > 3) {
        return node;
      }
      for (let i = node.initializer.arguments.length; i < 3; i++) {
        args.push(ts.factory.createIdentifier('undefined'));
      }
      let type = node.name.text;
      if (options.removeSelectPrefix && type.startsWith('select')) {
        type = type.substr(6);
      }
      type = formatType(options.selectorPrefix + type, options.selectorFormat);
      args.push(ts.factory.createStringLiteral(type));
      break;
    }
    default:
      return node;
  }
  return ts.factory.createVariableDeclaration(
    node.name,
    void 0,
    void 0,
    ts.factory.createCallExpression(node.initializer.expression, void 0, args),
  );
}

export function createKcatsTransformer(
  program: ts.Program | undefined,
  options?: KcatsTransformerOptions,
): ts.TransformerFactory<ts.SourceFile> {
  const fullOptions: Required<KcatsTransformerOptions> = {
    recursive: false,
    mutationPrefix: '',
    actionPrefix: '',
    selectorPrefix: '',
    mutationFormat: 'lower_underscore',
    actionFormat: 'lower_underscore',
    selectorFormat: 'lowerCamelCase',
    removeSelectPrefix: true,
    ...options,
  };
  return (context) => {
    return (source) => {
      const visitor: ts.Visitor = (node) => {
        const newNode = visitKcats(node, fullOptions);
        return newNode === node ? ts.visitEachChild(node, visitor, context) : newNode;
      };
      return ts.visitEachChild(source, visitor, context);
    };
  };
}
