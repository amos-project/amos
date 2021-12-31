# `amos`

An out-of-the-box state management library designed for your large-scale projects.

This is the common entry package includes the following packages.

- `amos-core`
- `amos-shapes`
- `amos-boxes`
- `amos-utils`
- `amos-persist`
- `amos-devtools`

However, the following packages are not included:

- `amos-react`
- `amos-redux`

## Usage

```
import { createStore, createBox } from 'amos';

const countBox = createNumberBox(0);

const store = createStore();

store.subscribe(() => {
  const count = store.select(countBox);
  console.log(count); // => 1
});

store.dispatch(countBox.incr());
```
