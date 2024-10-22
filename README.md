# Amos

Amos is a decentralized state management library, inspired by `redux`, `vuex` and `recoil`.

## Highlights

- Decentralized (or, in a more trendy term: atomic).
- Data structure-based: help you read/write state easily.
- Strong TypeScript support.
- All in one: everything in a single package `amos`, including:
  - All commonly used data structures: Number, Boolean, Array, Object, List, Map.
  - Box relationships.
  - Batch.
  - Concurrent.
  - Cache.
  - React: Query, Suspense, Use.
  - SSR.
  - HTTP: Paging, Optimistic, Offline, Structure mapping.
  - Persistence: including Web, React Native, IndexedDB, SQLite.
  - Devtools.
- Redux compatible, helping you seamlessly and smoothly migrate from Redux to amos.

## Install

You can get everything via install npm package `amos`:

```bash
# via npm
npm i -S amos
# via yarn
yarn add amos
# via pnpm
pnpm i amos
```

## Documentation

You can find the Amos documentation [on the website](https://amos-project.github.io/amos/).

## Quick start

```typescript jsx
import { createStore, numberBox } from 'amos';
import { Provider, useDispatch, useSelector } from 'amos/react';
import { createRoot } from 'react-dom/client';

const countBox = numberBox('count');

function Count() {
    const dispatch = useDispatch();
    const [count] = useSelector(countBox);

    return (
        <div>
            <span>Click count: {count}.</span>
            <button onClick={() => dispatch(countBox.add(1))}>Click me</button>
        </div>
    );
}

const store = createStore();

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <Count />
    </Provider>,
);
```
