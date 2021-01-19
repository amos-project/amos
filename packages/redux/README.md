# amos-redux

`amos-redux` allows you to use `amos` and `redux` at the same time without modifying your redux business.

## Feature

1. Allows you to use `amos`' `store.select()` (you can use it with `amos`' `useSelector()` in react
   function components) to select both `amos`' and `redux`'s state at the same time, and use `amos`'
   `store.dispatch()` (you can get it by `amos`' `useDispatch()` in react function components) to
   dispatch both `amos`' dispatchable things and `redux`'s actions.
2. Keeps the `amos`'s outstanding features: `selector caches` and `transactions`, you can get more
   detailed information about tis in [`Quick start`](#quick-start)'s example.

## Installation

```bash
yarn add amos-redux

# or var npm
npm i -S amos-redux
```

## Quick start

You can get a full online demo here: <a href="https://codesandbox.io/s/amos-hybrid-with-redux-knd9f?fontsize=14&hidenavigation=1&theme=dark" target="_blank">
<img alt="Edit Amos - hybrid with redux" src="https://codesandbox.io/static/img/play-codesandbox.svg">
</a>

The following code is the simplified:

```typescript jsx
import { createStore as createReduxStore } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import {
  createStore as createAmosStore,
  Provider as AmosProvider,
  useSelector,
  useDispatch,
} from 'amos';
import { withRedux } from 'amos-redux';

const reduxStore = createReduxStore(rootReducer);
const amosStore = createAmosStore(void 0, withRedux(reduxStore) /* hybrid redux store */);

ReactDOM.render(
  <ReduxProvider store={reduxStore}>
    <AmosProvider store={amosStore}>
      <MyApp />
    </AmosProvider>
  </ReduxProvider>,
  document.querySelector('#root'),
);

function MyApp() {
  const [amosState, reduxState] = useSelector(
    selectSomeAmosState,
    selectSomeReduxState /* select redux's state with amos' useSelector */,
  );
  const dispatch = useDispatch();
  const handleAmosClick = () => dispatch(someAmosAction());
  const handleReduxClick = () => dispatch(someReduxAction()); // dispatch redux's action with amos' dispatch
  return (
    <div>
      <div>
        <span>Amos state: {amosState} </span>
        <button onClick={handleAmosClick}>click me</button>
      </div>
      <div>
        <span>Redux state: {reduxState} </span>
        <button onClick={handleReduxClick}>click me</button>
      </div>
    </div>
  );
}
```

## API Reference

### withRedux(reduxStore)

```typescript
import { Store } from 'redux';
import { StoreEnhancer } from 'amos';

function withRedux(reduxStore: Store): StoreEnhancer;
```

**Parameters**

- `reduxStore`: the redux store you injected into your project

**Returns**

A `StoreEnhancer` which is used for amos [`createStore()`](https://github.com/acrazing/amos#createstore).

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
