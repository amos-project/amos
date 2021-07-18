# amos-persist

Ther persitor plugin for `amos`.

## Table of Contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [API Reference](#api-reference)
  - [Initialization](#initialization)
    - [withPersist(options)](#withpersistoptions)
    - [PersistOptions](#persistoptions)
    - [StorageEngine](#storageengine)
  - [Hydrate state](#hydrate-state)
    - [hydrate](#hydrate)
    - [hydrateStatusBox](#hydratestatusbox)
    - [HydrateStatusState](#hydratestautsstate)
  - [React integration](#react-integration)
    - [PersistGate](#persistgate)
    - [PersistGateProps](#persistgateprops)

## Installation

```bash
yarn add amos-persist

# or var npm
npm i -S amos-persist
```

## Quick start

1. Create the store

   ```typescript jsx
   import { createStore } from 'amos';
   import { withPersist } from 'amos-persist';

   const store = createStore(
     void 0,
     withPersist({
       engine: localStorage,
       key: 'AMOS_STATE_SNAPSHOT',
     }),
   );
   ```

2. Hydrate the state with react

   ```typescript jsx
   import { PersistGate } from 'amos-persist/react';
   import { Provider } from 'amos-react';
   import { useEffect, useState } from 'react';

   const App = () => {
     return (
       <Provider store={store}>
         <PersistGate loading={<Loading />}>
           <MyAwesomeComponent />
         </PersistGate>
       </Provider>
     );
   };
   ```

## API Reference

### Initialization

#### `withPersist(options)`

Create persist enhancer to load and persist state automatically.

```typescript
import { StoreEnhancer } from 'amos';

export declare function withPersist(options?: PersistOptions): StoreEnhancer;
```

#### `PersistOptions`

```typescript
export declare interface PersistOptions {
  /**
   * The key of the state persisted in the engine
   */
  key: string;
  /**
   * The engine of the persist, supports localStorage/sessionStorage
   * in browser, and AsyncStorage in react-native.
   */
  engine: StorageEngine;
  /**
   * determine the box should be persisted/hydrated or not.
   */
  includes?: Array<Box | string> | ((box: Box) => boolean);
  /**
   * determine the box should be persisted/hydrated or not.
   *
   * Please note the `excludes` has priority over `includes`.
   */
  excludes?: Array<Box | string> | ((box: Box) => boolean);
}
```

#### `StorageEngine`

```typescript
export declare interface StorageEngine {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
}
```

### Hydrate state

#### `hydrate()`

`hydrate` is a `ActionFactory` to start hydrate action.

```typescript jsx
import { ActionFactory } from 'amos';

export declare const hydrate: ActionFactory<[], Promise<void>>;
```

#### `hydrateStatusBox`

The hydrate status, it is a `Box`.

```typescript jsx
import { Box } from 'amos';

export declare const hydrateStatusBox: Box<HydrateStautsState>;
```

#### `HydrateStautsState`

```typescript jsx
export declare interface HydrateStautsState {
  status: 'PENDING' | 'HYDRATING' | 'OK' | 'ERROR';
  error: Error | null;
}
```

### React integration

Please note the following API should be imported from `amos-persist/react`
rather than `amos-persist`.

#### `PersistGate`

A component to hydrate state automatically

```typescript jsx
import { FC } from 'react';

export declare const PersistGate: FC<PersistGateProps>;
```

#### `PersistGateProps`

```typescript jsx
import { ReactElement } from 'react';

export declare interface PersistGateProps {
  loading?: ReactElement | null;
  children?: ReactElement | null;
}
```

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
