# amos-typescript-plugin

The typescript plugin for amos developers.

## Features

- auto add `type` for `mutation`, `action` and `selector`.

For example:

it will transform the following code:

```typescript jsx
import { Box, selector, action, identity } from 'amos';
export const countBox = new Box('count', 0, identity);
export const incrementCount = countBox.mutation((s) => s + 1);
export const incrementCountAsync = action(async (dispatch) =>
  Promise.resolve().then(() => dispatch(incrementCount())),
);
export const selectCountState = selector((select) => select(countBox));
```

to:

```typescript jsx
import { Box, selector, action, identity } from 'amos';
export const countBox = new Box('count', 0, identity);
export const incrementCount = countBox.mutation((s) => s + 1, 'increment_count');
export const incrementCountAsync = action(
  async (dispatch) => Promise.resolve().then(() => dispatch(incrementCount())),
  'increment_count_async',
);
export const selectCountState = selector(
  (select) => select(countBox),
  undefined,
  undefined,
  'countState',
);
```

## Installation

```bash
yarn add amos-typescript-plugin -D

# or var npm
npm i -D amos-typescript-plugin
```

## Usage

### With `webpack`

Add this plugin to your `ts-loader`'s options:

```typescript jsx
import { createAmosTransformer } from 'amos-typescript-plugin';
export default {
  // ...
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          getCustomTransformers: (program) => ({
            before: [
              createAmosTransformer(program, {
                /* options */
              }),
            ],
          }),
        },
      },
    ],
  },
};
```

### With `ttypescript`

Add this plugin to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "transform": "amos-typescript-plugin"
      }
    ]
  }
}
```

## API Reference

### createAmosTransformer(program, options?)

```typescript jsx
import ts from 'typescript';

export function createAmosTransformer(
  program: ts.Program | undefined,
  options?: AmosTransformerOptions,
): ts.TransformerFactory<ts.SourceFile>;
export default createAmosTransformer;
```

- `options`(`AmosTransformerOptions`): the preference for the plugin:

  ```typescript jsx
  export interface AmosTransformerOptions {
    // useless currently
    recursive?: boolean;
    // the mutations' prefix, default is ''
    mutationPrefix?: string;
    // the actions' prefix, default is ''
    actionPrefix?: string;
    // the selectors' prefix, default is ''
    selectorPrefix?: string;
    // the mutation type format, default is 'lower_underscore'
    mutationFormat?: TypeFormat;
    // the action type format, default is 'lower_underscore'
    actionFormat?: TypeFormat;
    // the selector type format, default is 'lowerCamelCase'
    selectorFormat?: TypeFormat;
    // remove selector's prefix 'select', default is true
    removeSelectPrefix?: boolean;
  }
  ```

- `TypeFormat`: the format strategy for type names, accepts:
  - `original`
  - `lowerCamelCase`
  - `UpperCamelCase`
  - `lower_underscore`
  - `UPPER_UNDERSCORE`

## License

```text
The MIT License (MIT)

Copyright (c) 2020 acrazing

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
