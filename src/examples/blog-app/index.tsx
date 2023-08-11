import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, Provider } from 'amos';
import App from './components/App';

// Initialize the amos store
const store = createStore();

// Render the App component and provide it with the amos store
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
