/*
 * @since 2020-11-03 13:25:08
 * @author acrazing <joking.young@gmail.com>
 */

import e from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createStore } from '../store';
import { App } from './app';
import { loadTodos } from './store/todo/todo_actions';

const app = e();

app.get('/todos', async (req, res) => {
  const store = createStore();
  await store.dispatch(loadTodos());
  res.end(`<!DOCTYPE html>
<html>
<head>
<title>Todo MVC</title>
<script>
var __INITIAL_STATE__ = ${JSON.stringify(store.getState()).replace(/</g, '\\u003c')};
</script>
</head>
<body>
<div id="root">${renderToString(<App store={store} />)}</div>
<script src="/bundle.js"></script>
</body>
</html>
`);
});
