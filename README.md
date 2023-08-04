# Amos

Amos is a decentralized global state management library inspired by `redux`, `vuex` and `recoil`.

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
import { createStore, NumberBox } from 'amos';
import { Provider, useDispatch, useSelector } from 'react';
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
