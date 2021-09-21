# amos

`Amos` is a decentralized state management library, inspired by `Redux`, `Vuex` and `Recoil`.

## Highlights

- [x] **😘 Decentralized**: no `rootReducer` or `rootStore`, store node is registered automatically.
- [x] **🥳 Out of the box**: no hidden advanced usage and learning costs, everything in one mono-repo.
- [x] **🥰 High performance**, many outstanding performance optimizations,
      especially [cached selectors](#selector-caches) and [transactions](#transactions).
- [x] **🧐 Strong typed**, all the API have clear parameter and return value types, especially in TypeScript
      projects.

**And more**:

- [x] **Lightweight**, The size of the two packages `amos` and `amos-react` is only 3kb after
      gzip compression, and they
      are [Tree-shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) friendly.
- [x] Works seamlessly with [React Hooks](#with-hooks) and [Class Components](#with-class-components).
- [x] Supports [server-side rendering(SSR)](#server-side-renderingssr) and [state persistent](#persistent)
- [x] Works seamlessly with `Redux`, you can [migrate your application from redux to amos](#migrate-with-redux) smoothly.
- [x] [Supports Redux devtools](#devtools), you do not need to install extra extension in your browser.
- [x] No complex concepts in `Redux`, such as action types, reducers, saga, thunk, and so on.

## Quick start

```typescript jsx
import { createStore, Box, action } from 'amos';
import { Provider, useSelector, useDispatch } from 'amos-react';

const countBox = new Box('count', 0);

const incr = action((dispatch, select, value: number) => {
  const count = select(countBox);
  dispatch(countBox.setState(count + value));
});

function Count() {
  const dispatch = useDispatch();
  const [count] = useSelector(countBox);

  return (
    <div>
      <span>Count: {count}</span>
      <button onClick={() => dispatch(incr())}>Add</button>
    </div>
  );
}

const store = createStore();

function App() {
  return (
    <Provider store={store}>
      <Count />
    </Provider>
  );
}
```

[![Edit Amos count](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/amos-count-wxdb5?fontsize=14&hidenavigation=1&theme=dark)

## Documentation

1. Installation
2. Tutorials
   1. Counter
   2. Todo MVC
3. Concepts
   1. Store
   2. Box
   3. Action
   4. Selector
   5. Signal
4. React binding
5. Shape of the state
6. Async actions
7. Performance improvements
   1. Transactions
   2. Selector caches
8. Server side rendering
9. Persistent
10. Migrate from redux
11. Devtools
12. Enhance amos
13. API Reference

## License

```
The MIT License (MIT)

Copyright (c) 2021 acrazing

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
