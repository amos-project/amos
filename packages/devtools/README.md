# amos-remotedev

Amos DevTools with redux-devtools-extension.

## Usage

1. Install this module

   ```bash
   yarn add amos-devtools

   # or var npm
   npm i -S amos-devtools
   ```

2. Install the [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension#installation)
   in your browser

3. Enable this devtools when you create `amos` store:

   ```typescript jsx
   import { withDevTools } from 'amos-devtools';
   import { createStore } from 'amos';

   const store = createStore(preloadedState, withDevTools(), ...otherEnhancers);
   ```

Now you can use `redux-devtools-extension` in your browser with `amos` like it with `redux`.

![screenshot.png](./assets/screenshot.png)

## API Reference

### withDevTools(options?)

```typescript jsx
import { StoreEnhancer } from 'amos';

export function withDevTools(options?: DevToolsOptions): StoreEnhancer;
```

**Parameters**

- `options`: an optional `DevToolsOptions` object

  ```typescript jsx
  export interface DevToolsOptions {
    /**
     * The name of the store, default is the title of the page
     */
    name?: string;
    /**
     * Force disable devtools even if using {@see forceWithDevTools}
     */
    disable?: boolean;
  }
  ```

**Returns**

A `StoreEnhanceer` to enable devtools.

### forceWithDevTools(options?)

```typescript jsx
import { StoreEnhancer } from 'amos';

export function forceWithDevTools(options?: DevToolsOptions): StoreEnhancer;
```

The API is similar to [`withDevTools`](#withdevtoolsoptions).

The difference between `withDevTools` and `forceWithDevTools` is:

`withDevTools` only works with `process.env.NODE_ENV === 'development'`, but `forceWithDevTools`
always works.

## License

```
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
