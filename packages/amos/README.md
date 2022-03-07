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
import { NumberBox, createStore } from 'amos';
import { Provider, useSelector, useDispatch } from 'amos/react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

const countBox = new NumberBox('count');

const store = createStore();

const Counter = () => {
  const [count] = useSelector(countBox);
  const dispatch = useDispatch();
  const handleClick = () => dispatch(countBox.add(1));
  return (
    <div>
      Click count: {count}.&nbsp;
      <button onClick={handleClick}>Click me</button>
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
```
