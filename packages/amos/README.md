# `amos`

`Amos` is an out-of-the-box state management library designed for large scale projects.

The `amos` is the all-in-one package for all the builtin modules of amos. It includes several
entrypoint, each entrypoint contains one or more packages. The entrypoint are:

| entrypoint   | included packages                                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `amos`       | <ul><li>amos-core</li><li>amos-boxes</li><li>amos-shapes</li><li>amos-io</li><li>amos-persist</li><li>amos-devtools</li><li>amos-utils</li></ul> |
| `amos/react` | <ul><li>amos-react</li></ul>                                                                                                                     |
| `amos/redux` | <ul><li>amos-redux</li></ul>                                                                                                                     |

## Install

```bash
npm i -S amos
# or via yarn
yarn add amos
```

## Quick start

```typescript jsx
import { createStore, NumberBox } from 'amos';
import { Provider, useDispatch, useSelector } from 'amos-react';
import { createRoot } from 'react-dom/client';

const countBox = new NumberBox('count');

function Count() {
  const dispatch = useDispatch();
  const [count] = useSelector(countBox);

  return (
    <div>
      <span>Click count: {count}</span>
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
