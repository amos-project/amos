# undux
A decentralized state manager for react

## Usage

```typescript jsx
import { Provider, createStore, createContainer, createAction, createSelector, useSelector, useStore, useDispatch } from 'moedux';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

async function serverRender() {
  const store = createStore()
  await store.dispatch(loadTodoList())

  const app = ReactDOMServer.renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  )
  
  return `<!DOCTYPE html>
<html>
<head>
<title>Todo MVC</title>
<script>
  const __INITIAL_STATE__ = ${JSON.stringify(store.getState()).replace('<', '\\u003a')};
</script>
<body>
<div id="root">{app}</div>
</body>
</html>`
}

function clientRender() {
  const store = createStore()
  store.preload(__INITIAL_STATE__)
  ReactDOM.hydrate(
    <Provider store={store}>
      <App />
    </Provider>,
    document.querySelector('#root'),
  )
}

function App() {
  return (
    <div>
      <TodoInput />
      <TodoList />
      <TodoFilter />
    </div>
  )
}

function TodoInput() {
  const [value, setValue] = useState('')
  const dispatch = useDispatch()
  const handleSubmit = () => {
    dispatch(addTodo(value))
  }
  return (
    <div>
      <input value={value} onChange={(e) => setValue(e.target.value)}/>
      <button disabled={!value.trim()} onClick={handleSubmit}>Add</button>
    </div>
  )
}

function TodoList() {
  const [todos] = useSelector(selectVisibleTodos())
  const dispatch = useDispatch()
  const handleDelete = (id: number) => {
    dispatch(removeTodo(id))
  }
  const handleDone = (id: number) => {
    dispatch(updateTodo({ id, done: true })
  }
  return (
    <ul>
      {todos.map((t) => <TodoItem key={t.id} item={t} handleDone={handleDone} handleDelete={handleDelete} />
    </ul>
  )
}

function TodoItem({ item, handleDone, handleDelete }) {
  return (
    <li key={t.id}>
      <span>{t.title}</span>
      {!t.done && <button onClick={() => handleDone(t.id)}>Done</button>}
      <button onClick={() => handleDelete(t.id)}>Delete</button>
    </li>
  )
}

function TodoFilter() {
  const dispatch = useDispatch()
  const handleShow = (mode: string) {
    dispatch(setVisibleMode(mode))
  }
  return (
    <div>
      <span>Show:</span>
      <button onClick={() => handleShow('all')}>All<button>
      <button onClick={() => handleShow('new')}>New</button>
      <button onClick={handleShow('done')}>Done</button>
    </div>
  )
}

interface TodoModel {
  id: number;
  title: string;
  done: boolean;
}

const TodoContainer = createContainer({
  id: 'todo',
  initialState: {
    visibleMode: 'all',
    todos: [],
  },
  actions: {
    add: (state, todo: TodoModel) => ({
      ...state,
      todos: state.concat(todo),
    }),
    update: (state, todo: TodoModel) => ({
      ...state,
      todos: state.map(t => t.id === todo.id ? todo : t),
    }),
    remove: (state, id: number) => ({
      ...state,
      todos: state.filter(t => t.id !== id)
    }),
  }),
})

const addTodo = createAction((title: string) => (store) => {
  store.get(TodoContainer).add({ id: Date.now(), title, done: false })
})

const selectTodos = createSelector((store, mode?: string) => {
  const todo = store.getState(TodoContainer)
  mode ??= todos.visibleMode
  if (mode === 'all') {
    return todo.todos
  }
  const done = mode === 'done'
  return todo.todos.filter(t => t.done === done)
})
```
