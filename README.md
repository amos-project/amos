# amos

Amos is a decentralized state manager for react, inspired by Redux, Vuex and Recoil.

## Highlights

- **😘 Decentralized**, no `compose`, no `root`, state is registered automatically
- **😍 Out of the box**, no `plugins`, no `middlewares`, no `toolkits`, and no `xxx-react`
- **🥰 Fast**, `selector` is cached, only subscribed component will update
- **🤩 Lightweight**, the package size is only `2.1kb` after gzip
- **😲 Tiny**, `functional`, no `reducers`, every dead line could be dropped by [Tree-shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)
- **🥳 Strong typed**, all the API has explicit params and return types with TypeScript

**WARNING: THE API IS DESIGNING**

## Table of Contents

- [Quick start](#Quick-start)
- [Concepts](#Concepts)
  - [Store](#Store)
  - [Boxes](#Boxes)
  - [Mutations](#Mutations)
  - [Actions](#Actions)
  - [Events](#Events)
  - [Selectors](#Selectors)
- [Tutorials](#tutorials)
  - [Transactions](#transactions)
  - [Selector caches](#selector-caches)
  - [Server side rendering(SSR)](#server-side-renderingssr)
- [API Reference](#API-Reference)
  - Core
  - [box()](#box)
  - [mutation()](#mutation)
  - [action()](#action)
  - [event()](#event)
  - [selector()](#selector)
  - [createStore()](#createstore)
    - [store.getState()](#storegetstate)
    - [store.pick()](#storepick)
    - [store.dispatch()](#storedispatch)
    - [store.subscribe()](#storesubscribe)
    - [store.select()](#storeselect)
  - React binding
  - [\<Provider />](#provider-)
  - [\<Consumer />](#consumer-)
  - [useSelector()](#useselector)
  - [useDispatch()](#usedispatch)
  - [useStore()](#usestore)
  - [connect()](#connect)

## Quick start

[![Edit Amos count](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/amos-count-wxdb5?fontsize=14&hidenavigation=1&theme=dark)

```typescript jsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  box,
  identity,
  mutation,
  selector,
  Provider,
  createStore,
  useDispatch,
  useSelector,
} from 'amos';

const counter = box('counter', 0, identity);

const increment = mutation(counter, (state, incr: number) => state + incr);

const selectCount = selector(counter, (store, count) => count);

function Count() {
  const [count] = useSelector(selectCount());
  const dispatch = useDispatch();
  const handleAdd = () => dispatch(increment(1));
  return (
    <div>
      <span>Click count: {count}</span> <button onClick={handleAdd}>Click me</button>
    </div>
  );
}

const store = createStore();

ReactDOM.render(
  <Provider store={store}>
    <Count />
  </Provider>,
  document.querySelector('#root'),
);
```

## Concepts

### Store

### Boxes

### Mutations

### Actions

### Events

### Selectors

## Tutorials

### Transactions

### Selector caches

### Server side rendering(SSR)

## API Reference

### box()

### mutation()

### action()

### event()

### selector()

### createStore()

#### store.getState()

#### store.pick()

#### store.dispatch()

#### store.subscribe()

#### store.select()

### \<Provider />

### \<Consumer />

### useSelector()

### useDispatch()

### useStore()

### connect()

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
