# amos

Amos is a decentralized state manager for `React`, inspired by `Redux`, `Vuex` and `Recoil`.

## Highlights

- **😘 Decentralized**, no `rootReducer` or `combineReducers`, state is registered automatically
- **🥰 High performance**, many outstanding performance optimizations, especially with
  [cached selectors](#selector-caches) and [transactions](#transactions)
- **🥳 Out of the box**, no `plugins`, no `middlewares`, no `toolkits`, and no `xxx-react`

And more:

- **Strong typed**, all the API has explicit params and return types with TypeScript
- **Lightweight**, the package size is less than `3kb` after gzip, and
  [Tree-shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) friendly
- **Complete**, supports [server-side rendering(SSR)](#server-side-renderingssr),
  [hooks](#with-hooks) and [class components](#with-class-components)
- **Easy to use**
  - The core concepts and API is similar to `Redux`
  - Easy to hybrid with redux: [`amos-redux`](https://github.com/acrazing/amos-redux)
  - Works with `redux-devtools` for development: [`amos-redux-devtools`](https://github.com/acrazing/amos-redux-devtools)

**WARNING: THE API IS DESIGNING**

## Installation

```bash
yarn add amos

# or var npm
npm i -S amos
```

## Quick start

[![Edit Amos count](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/amos-count-wxdb5?fontsize=14&hidenavigation=1&theme=dark)

```typescript jsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Box, createStore, Provider, useDispatch, useSelector, identity } from 'amos';

const countBox = new Box('count', 0, identity);
const increment = countBox.mutation((state) => state + 1);

function Count() {
  const dispatch = useDispatch();
  const [count] = useSelector(countBox);
  const handleAdd = () => dispatch(increment());
  return (
    <div>
      Click count: {count} <button onClick={handleAdd}>Click me</button>
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

## Examples

### Blog App

This is an example blog application built with `amos` and `react`. It includes features such as multiple accounts, blogs, and comments. You can find the source code in the [examples/blog-app](https://github.com/amos-project/amos/tree/main/examples/blog-app) directory.

### TodoMVC

[![Edit Amos - TodoMVC](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/new-bush-40rzm?fontsize=14&hidenavigation=1&theme=dark)

## Table of Contents

- [Concepts](#concepts)
  - [Store](#store)
  - [Boxes](#boxes)
  - [Mutations](#mutations)
  - [Actions](#actions)
  - [Signals](#signals)
  - [Selectors](#selectors)
- [React integration](#react-integration)
  - [With react hooks](#with-react-hooks)
  - [With class components](#with-class-components)
- [Receipts](#receipts)
  - [Transactions](#transactions)
  - [Selector caches](#selector-caches)
  - [Server side rendering(SSR)](#server-side-renderingssr)
  - [Hybrid with `Redux`](#hybrid-with-redux)
  - [Devtools](#devtools)
- [API Reference](#api-reference)
  - Core
  - [box()](#box)
    - [box.subscribe()](#boxsubscribe)
    - [box.mutation()](#boxmutation)
  - [action()](#action)
  - [signal()](#signal)
  - [selector()](#selector)
  - [createStore()](#createstore)
    - [store.dispatch()](#storedispatch)
    - [store.select()](#storeselect)
    - [store.snapshot()](#storesnapshot)
    - [store.subscribe()](#storesubscribe)
  - React integration
  - [\<Provider />](#provider-)
  - [\<Consumer />](#consumer-)
  - [useSelector()](#useselector)
  - [useDispatch()](#usedispatch)
  - [useStore()](#usestore)
  - [connect()](#connect)

## Concepts

### Store

A `store` is an isolated world, everything will only happen in one store,
and there will be no correlation between different stores. You can create
a `store` by calling [`createStore()`](#createstore):

```typescript
import { createStore } from 'amos';

const store = createStore();
```

The function `createStore` accepts one optional parameter `preloadedState`.
If your project uses server-side rendering(SSR), or has other pre-loaded
states, you can call this function like this:

```typescript
const store = createStore(somePreloadedState);
```

This is different from redux, you don't need to pass in a `reducer`, which
is the main culprit for centralizing redux. Centralization makes redux very
difficult to manage in large projects.

The `store` provides two primary methods: the first one is `dispatch`,
which is used to modify the state of the `store`, and the other is
`select`, which is used to select the state of the `store`.

We need to create a simple [`box`](#box) and [`mutation`](#mutation) to
demonstrate this feature. Don't worry, it's just two very simple line of code,
and you can get the full picture of the `box` and `mutation` in the
[following document](#box).

Now, we will create the `box` at first:

```typescript
import { box, identity } from 'amos';

const countBox = box('count', 0, identity);
```

In the above code, we created a `box` called `countBox`, its initial state is
the number `0`. And then, we need to create a `mutation` to mutate it:

```typescript
import { mutation } from 'amos';

const increment = mutation(countBox, (state) => state + 1);
```

As you can see, we created a `mutation` called `increment`, it will mutate
`countBox`'s state, let it add `1`.

Now we begin to show how to select and mutate the state of `countBox`, it
is very simple:

```typescript
const originalCount = store.select(countBox);
store.dispatch(increment());
const updatedCount = store.select(countBox);
console.log([originalCount, updatedCount]));
```

The first line of the above code selects the state of `countBox`, it should be
the initial state of `countBox`, which is `0`. In the second line, we dispatched
a mutation `increment` to mutate `countBox`, it should add `countBox` state to `1`.
So, the result of the above code will print `[0, 1]` in console.

### Boxes

A `box` is a container to keep some metadata of a state node, such as the
key in store, and initial state of the box, etc. The `box` is the key object
to associate `store` and `mutations`, `selectors` and `signals`. You can use
[`box()`](#box) to create a `box`:

```typescript
import { box, identity } from 'box';

export const countBox = box('count', 0, identity);
```

As you can see, you have seen these lines of code in the [`Store`](#store)
section. We will explain this function in detail here.

The first parameter is the `key` of the `box`, it **MUST** be a string and
unique in your project's boxes, it is used internally, so it can be a string
in any format, the only thing you should care about is **KEEP IT UNIQUE**.

The second one is the initial state of the box, please note it is **NOT** a
factory to create initial state, because the state **SHOULD BE IMMUTABLE**.

And the last one parameter is `preload`, which is used for transform preloaded
state to its state. We need this parameter because sometimes state is different
to preloaded state. For example, if a box's state is a `Immutable.js`'s `Record`,
and use `JSON` to serialize it, you can use this method to convert it:

```typescript
import { box } from 'box';
import { Record } from 'immutable';

class UserState extends Record({
  firstName: '',
  lastName: '',
}) {}

export const userBox = box('user', new UserState(), (preloadedState, state) => {
  return state.merge(preloadedState);
});
```

As you can see, the `preload` function accepts two parameters `preloadedState` and
`state`, and returns the transformed state. If your state is pure object, does not
need transform, you can use `identity` to use `preloadedState` directly, which is
provided by `amos` as the `countBox` created above.

In most cases, you only need to use the box itself, without paying attention to the
methods or properties it provides, except when you need to subscribe to [signals](#signals).

### Mutations

A `Mutation` is an object which will mutate a `box`'s state when it is dispatched.

You can create a `MutationFactory` by calling [`mutation()`](#mutation):

```typescript
import { mutation } from 'amos';
export const addCount = mutation(countBox, (state, delta: number) => state + delta);
const result = store.dispatch(addCount(1));
```

The [`mutation()`](#mutation) function accepts two parameters called `box` and `mutator`,
and returns a `MutationFactory`. The `box` is a box defined by calling [`box()`](#boxes),
such as `countBox` upon. And the `mutator` is a function accepts two parameters called
`state` and `action`, and returns the mutated new state of the `box`. The
`MutationFactory` is a function accepts one optional parameter called `action` and
returns a `Mutation`.

The `Mutation` is dispatchable, which means you can use it as the parameter of
[`store.dispatch()`](#storedispatch). When it is dispatched, the following things will
happen:

- the `mutator` will be called with two parameters which are the state of the `box` and
  the parameter passed in when the `MutationFactory` is called.
- the state of the `box` will be set as the return value of the `mutator`.
- the return value of the `store.dispatch()` will be the parameter passed in when the
  `MutationFactory` is called.

In the code above, we created a `MutataionFactory` called `addCount`, which will add
the state of the `countBox` with `delta`. And dispatched `addCount` with `delta` equals
to `1`. The value of `result` should be `1`.

### Actions

An `action` is an object which will do something asynchronous or synchronous, and
dispatch some `Mutations`, `Signals`, other `Actions` when it is dispatched.

You can create an `ActionFactory` by calling [`action()`](#action):

```typescript
import { action } from 'amos';

declare function myDBSetCount(count: number): Promise<void>;

export const addCountAsync = action((dispatch, select, delta: number) => {
  const count = select(countBox);
  return myDBSetCount(count + delta).then(() => dispatch(addCount(delta)));
});

const result = await store.dispatch(addCountAsync(2));
```

The [`action()`](#action) accepts one parameter called `actor`, and returns an
`ActionFactory`. The `actor` is a function which will be called when you dispatch
the `Action`. The `ActionFactory` is a function, which will return an `Action`.

The `Action` is dispatchable, when you dispatch it, the `actor` will be called
with the following parameters: `dispatch`, `select` and the parameters passed in
when the `ActionFactory` is called. The `dispatch` and `select` are the
[`store.dispatch`](#storedispatch) and [`store.select`](#storeselect), which
allow you to dispatch some dispatchable things and select states. The return
value of `store.dispatch(action)` is the return value of `actor`.

### Signals

A `SignalFactory` is a function to create an `Signal`, and could be subscribed by
a `box`. A `Signal` is an object, which will trigger the subscribed `boxes`
to mutate these states when you dispatch it.

You can create a `SignalFactory` by calling [`signal()`](#signal), and subscribe its
`Signals` by calling [`box.subscribe()`](#boxsubscribe):

```typescript
import { signal } from 'amos';

export const reset = signal((count: number) => ({ count }));

countBox.subscribe(reset, (state, data) => data.count);

store.select(countBox);

store.dispatch(reset(1));
```

The function [`signal()`](#signal) accepts one optional parameter called `creator` and
returns a `SignalFactory`. The `creator` is an optional function, which is called when
you call `SignalFactory`, its return value will be used as the second parameter of the
subscribers and the return value of [`store.dispatch()`](#storedispatch) when you
dispatch it.

**Please note that a signal will only be dispatched to the boxes which is invoked
already(`select(box)` and `dispatch(mutation)` will invoke the relative `box`
automatically).**

### Selectors

`Store` provides an api called [`select`](#storeselect), which allows you to select
a `box`'s state or execute a `selector`. For example: you can get a box's state like
this:

```typescript
const count = store.select(countBox);
```

A `selector` is a function, which accepts one parameter `select`, which is the
[`store.select`](#storeselect), you can use the parameter to select a box or another
`selectors`. For example:

```typescript
import { Select } from 'amos';

const selectDoubleCount = (select: Select) => select(countBox) * 2;

const doubleCount = store.select(selectDoubleCount);
```

In this case, the `selectDoubleCount` select the state of `countBox`, and returns its
double value.

Sometimes, a `selector` dependents on some external parameters. If you want to
provide a public selector for your `box`'s users, you may write some codes like this:

```typescript
import { Select } from 'amos';

export const selectMultipleCount = (multiplier: number) => {
  return (select: Select) => select(countBox) * multiplier;
};

const tripleCount = store.select(selectMultipleCount(3));
```

That seems a bit complicated, but don't worry, we provide a function
[`selector()`](#selector) to help you create a curried selector, and it
brings more additional benefits. For example:

```typescript
import { selector } from 'amos';

const selectMultipleCount = selector((select, multiplier: number) => {
  return select(countBox) * multiplier;
});

const tripleCount = store.select(selectMultipleCount(3));
```

As you can see, the [`selector()`](#selector) function accepts one parameter
to select a value, which accepts a `select` and one or more parameters which
is passed in when the returned function is called.

In addition, the [`selector()`](#selector) accepts another parameter called
`deps`, which allows you to cache the result of the selector. You can get
more information at [#Selector caches](#selector-caches).

## React integration

First of all, whether you use `hooks` or `class components`, you need to use
[`<Provider />`](#provider-) outside these components to inject the `store`
to create the world. The best way is to put the `<Provider />` in your root
component. For example:

```typescript jsx
import * as ReactDOM from 'react-dom';
import { createStore, Provider } from 'amos';

const store = createStore();

ReactDOM.render(
  <Provider store={store}>
    <MyApp />
  </Provider>,
  document.querySelector('#root'),
);
```

### With react hooks

With react hooks, you can use [`useSelector()`](#useselector)
to select states and use `useDispatch()` to get the
[`store.dispatch()`](#storedispatch) to dispatch a dispatchable thing.

For example:

```typescript jsx
import { useSelector, useDispatch } from 'amos';

function Count() {
  const dispatch = useDispatch();
  const [count, doubleCount, trippleCount] = useSelector(
    countBox,
    selectDoubleCount,
    selectMultipleCount(3),
  );
  const handleAdd = () => dispatch(increment());
  return (
    <div>
      <span>Click count: {count}</span>
      <span>Click count double: {doubleCount}</span>
      <span>Click count tripple: {trippleCount}</span>
      <button onClick={handleAdd}>Click me</button>
    </div>
  );
}
```

As you can see, [`useDispatch()`](#usedispatch) just returns the
[`store.dispatch`](#storedispatch). And [`useSelector()`](#useselector)
accepts multiple `Selector` or `Box`, it returns an array of the
parameters select result.

### With class components

With class components, you can use [`connect()`](#connect) to create
a high order component(HOC) with the state injected to the component.

`connect` accepts one optional parameter called `mapProps`, and returns
a function called `Connector`. The `mapProps` is a function that maps
the selected state to the props. The `Connector` accepts a `ComponentType`
object, and returns a new `ComponentType`.

`Connect` and `react-redux`'s `connect` are basically the same, but we
simplified some of its features. Specifically, they have these differences:

1. It always injects `dispatch` to the HOC.
2. It does not support `mapActions`.
3. The `mapProps`'s first parameter is [`store.select`](#storeselect)
   rather than the state.
4. It will not copy static props from the wrapped component to the new component.

For example:

```typescript jsx
import { PureComponent } from 'react';
import { connect, ConnectedProps } from 'amos';

export interface CouuntProps extends ConnectedProps {
  count: number;
}

export class Count extends PureComponent<CountProps> {
  render() {
    return (
      <div>
        <span>Click count: {this.props.count}</span>
        <button onClick={() => this.props.dispatch(increment())}>Click me</button>
      </div>
    );
  }
}

export const ConnectedCount = connect((select) => ({
  count: select(countBox),
}))(Count);
```

Please note that `connect` cannot use as decorator with typescript for the reason
of the ECMAScript specification. The following code is ok with `babel`, but will
emit some type errors with `TypeScript`:

```typescript jsx
import { connect } from 'amos';

@connect()
class SomeComponent extends Component {
  // ...
}
```

If you want to do this, you can create your own connector with some extra code:

```typescript jsx
import { connect, Select } from 'amos';

export function myConnect(
  mapper?: (select: Select, ownedProps: unknown) => unknown,
): ClassDecorator {
  return connect(mapper) as any;
}

@myConnect()
export class SomeComponent extends Component {
  // ...
}
```

## Receipts

### Transactions

Every call of [`store.dispatch(dispatchable)`](#storedispatch) will notify all
the subscribers which are registered by [`store.subscribe()`](#storesubscribe).
Which means if you call `store.dispatch` twice synchronously, the subscribers
will be called twice yet. Something will make the thing different:

1. call `store.dispatch` with a `dispatchable` array:

   ```typescript jsx
   store.dispatch([increment(), increment()]);
   ```

2. dispatch `dispatchables` in an `action` **synchronous**:

   ```typescript jsx
   const incrementTwice = action((dispatch) => {
     dispatch(increment());
     dispatch(increment());
   });

   store.dispatch(incrementTwice());
   ```

Both of the two actions will only notice the subscribers once. **Please
note the `2nd` one needs to be `synchronous`, which means the
asynchronous dispatches are separated, you MUST call the `dispatch()`
in the `1th` form in your asynchronous actions.** For example:

```typescript jsx
const exampleAction = action(async (dispatch) => {
  dispatch(actionA());
  dispatch(mutationB());
  dispatch(signalC());
  // the upon three dispatches are in one transaction

  await doSomething();
  dispatch(actionD());
  dispatch(mutationE());
  dispatch(signalF());
  // the upon three dispatches are three separate transaction

  dispatch([actionG(), mutationH(), signalI()]);
  // the upon dispatch will dispatch the three dispatchable in a transaction
});
```

### Selector caches

When you use [`useSelector`](#useselector) in your component, the component
should update if the state of boxes updated. the `useSelector` will caches
the last parameters and state snapshots and the result of it. If a `dispatch`
mutated the state which is not depended by the selectors, the component will
not rerender. It is fantastic!

Consider you have a component as follow:

```typescript jsx
import { memo } from 'react';
const MultipleCount = memo<{ multipler: number }>(({ multiper }) => {
  const [count] = useSelector(selectMultipleCount(multipler));
  return (
    <div>
      Click count * {multipler}: {count}
    </div>
  );
});
```

And it is used multiple times in a component:

```typescript jsx
function ShowCount() {
  return (
    <div>
      <MultipleCount multipler={1} />
      <MultipleCount multipler={2} />
      <MultipleCount multipler={3} />
    </div>
  );
}
```

TODO

In addition, [`selector()`](#selector) accepts the second parameter called `deps`,
which is a function also. The `deps` should accepts parameters same to the `fn`, and
returns an array as the cache key, it will be called in `useSelector` to check if the
selector should be rerun. For example:

```typescript jsx
const selectFactorialCount = selector(
  (select) => factorial(select(countBox)),
  (select) => [select(countBox)],
);
```

The selector will not be recomputed if the `countBox`'s state is not changed.

### Server side rendering(SSR)

In server-side, `store` provides a method [`store.snapshot()`](#storesnapshot)
allows you to get all states allocated in the store, and you can print it
to your HTML page as follow:

```typescript jsx
const store = createStore();
await store.dispatch(something);
const html = `<script>var __INITIAL_STATE__ = ${JSON.stringify(store.snapshot()).replace(
  /</g,
  '\\u003c',
)}</script>`;
```

In client side, you can read it as the preloaded state to create the store:

```typescript jsx
const store = createStore(__INITIAL_STATE__);
```

### Hybrid with redux

### Devtools

## API Reference

### box()

`box()` is the **ONLY** way to create a `Box`:

```typescript jsx
function box<S>(
  key: string,
  initialState: S,
  preload: (preloadedState: JSONState<S>, state: S) => S,
): Box<S>;

interface Box<S> {
  subscribe<D>(signal: SignalFactory<any[], D>, fn: (state: S, data: D) => S): void;
}
```

`Box` is `selectable`.

#### box.subscribe()

`box.subscribe(signal, fn)` let the box mutate its state when the `signal` is dispatched.

#### box.mutation()

`box.mutation()` is the **ONLY** way to create a `MutationFactory`:

```typescript jsx
function mutation<S, A>(
  box: Box<S>,
  mutator: (state: S, action: A) => S,
): (action: A) => Mutation<S, A>;

export interface Mutation<S, A> {}
```

`Mutation` is `dispatchable`.

### action()

`action()` is the way to create an `ActionFactory`:

```typescript jsx
function action<A extends any[], R>(
  actor: (dispatch: Dispatch, select: Select, ...args: A) => R,
): (...args: A) => Action<R>;

export interface Action<R> {
  (dispatch: Dispatch, select: Select): R;
  type?: string;
}
```

**Action** is `dispatchable`.

### signal()

`signal()` is **ONLY** way to create an `SignalFactory`:

```typescript jsx
function signal(): () => Signal<void>;

function signal<D>(): (data: D) => Signal<D>;

function signal<A extends any[], D>(creator: (...args: A) => D): (...args: A) => Signal<D>;

export interface Signal<D> {}
```

**Signal** is `dispatchable`.

### selector()

`selector()` is the way to create a `SelectorFactory`:

```typescript jsx
function selector<A extends any[], R>(
  fn: (select: Select, ...args: A) => R,
  deps?: (select: Select, ..args: A) => unknown[],
): (...args: A) => Selector<R>

export interface Selector<R> {
  (select: Select): R;
}
```

`Selector` is `selectable`.

### createStore()

create a store:

```typescript jsx
function createStore(
  preloadedState?: Record<string, unknown>,
  ...enhancers: Array<(store: Store) => Store>
): Store;

interface Store {
  snapshot: () => Record<string, unknown>;
  dispatch: Dispatch;
  select: Select;
  subscribe: (fn: (mutated: Box[]) => void) => () => void;
}
```

#### store.dispatch()

`store.dispatch()` dispatch one or more `dispatchable` to mutate the state and
notify subscribers.

```typescript jsx
interface Dispatch {
  <R>(dispatchable: Dispatchable<R>): R;
  <R>(dispatchables: Dispatchalbe<R>[]): R[];
}
```

#### store.select()

`store.select()` select a `selectable`:

```typescript jsx
interface Select {
  <R>(selectable: Selectable<R>, allocator?: [Record<string, unknown>?]): R;
}
```

#### store.snapshot()

`store.snapshot()` returns the state's snapshot.

#### store.subscribe()

`store.subscripbe(fn)` subscribes the updates.

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