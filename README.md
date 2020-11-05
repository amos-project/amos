# moedux

A decentralized state manager for react, inspired by Redux, Vuex and Recoil.

## Highlights

- **😘 Decentralized**, no `compose`, no `root`, state is registered automatically
- **😍 Out of the box**, no `plugins`, no `middlewares`, no `toolkits`, and no `xxx-react`
- **🤩 Lightweight**, the package size is only `1.8kb` after gzip
- **😲 Tiny**, `functional`, no `reducers`, every dead line could be dropped by [Tree-shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)

**WARNING: THE API IS DESIGNING**

## Table of Contents

- [Quick start](#Quick-start)
- [Concepts](#Concepts)
  - [Boxes](#Boxes)
  - [Mutations](#Mutations)
  - [Actions](#Actions)
  - [Events](#Events)
  - [Selectors](#Selectors)
  - [Store](#Store)
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

You can get example usage in [example](./src/example) directory.

1. create `Todo` store

   1. create box

      ```typescript jsx
      import { box } from 'moedux';

      export const Todo = box(
        'todo', // <= key
        { visibleMode: 'ALL', todos: [] }, // <= initial state
        (state, preloadedState) => preloadedState, // <= load preloaded state
      );
      ```

   2. create mutations

      ```typescript jsx
      import { mutation } from 'moedux';

      export const addTodo = mutation(
        Todo, // <= box
        (state, todo) => ({ ...state, todos: [todo].concat(state.todos) }), // <= mutator
      );
      ```

   3. create actions

      ```typescript jsx
      import { action } from 'moedux';

      export const addTodoAsync = action(
        // executor
        async ({ dispatch }, title: string) => {
          const todo = await myDBCreateTodo(title);
          return dispatch(addTodo(todo));
        },
      );
      ```

   4. create selectors

      ```typescript jsx
      import { selector } from 'moedux';

      export const selectLatestTodos = selector(
        Todo, // <= box
        (store, state, limit: number) => state.todos.slice(0, limit), // <= selector
        (store, state, limit) => [state.todos, limit], // <= cache key
      );
      ```

2. use with react

   1. render component with store

      ```typescript jsx
      import { createStore, Provider } from 'moedux';
      import { render } from 'react-dom';

      const store = createStore(); // <= no box(reducer) needed

      render(
        <Provider store={store}>
          <TodoMVC />
        </Provider>,
        document.querySelector('#root'),
      );
      ```

   2. use in react components

      ```typescript jsx
      import { useSelector, useDispatch } from 'moedux';

      export function TodoMVC() {
        const [latestTodos] = useSelector(selectLatestTodos);
        const dispatch = useDispatch();
        const handleKeyUp = (e) => {
          if (e.keyCode === 13) {
            dispatch(addTodoAsync(e.currentTarget.value));
          }
        };

        return (
          <div>
            <div>
              <input onKeyUp={handleKeyUp} />
            </div>
            <ul>
              {latestTodos.map((t) => (
                <li key={t.id}>{t.title}</li>
              ))}
            </ul>
          </div>
        );
      }
      ```

## Concepts

### Boxes

### Mutations

### Actions

### Events

### Selectors

### Store

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
