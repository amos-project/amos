import { TodoMVC } from './TodoMVC/TodoMVC';
import TodoMVCCode from './TodoMVC/TodoMVC?raw';
import React, { FC, useState } from 'react';
import { Counter } from './Counter/Counter';
import CounterCode from './Counter/Counter?raw';
import './App.css';
import { WithStore } from './WithStore/WithStore';
import WithStoreCode from './WithStore/WithStore?raw';

interface Example {
  name: string;
  component: FC;
  code: string;
}

const examples: Example[] = [
  {
    name: 'Counter',
    component: Counter,
    code: CounterCode,
  },
  {
    name: 'TodoMVC',
    component: TodoMVC,
    code: TodoMVCCode,
  },
  {
    name: 'CreateStore',
    component: WithStore,
    code: WithStoreCode,
  },
];

function App() {
  const [example, setExample] = useState(
    () => examples.find((s) => s.name === location.hash.substring(1)) ?? examples[0],
  );

  return (
    <div className="app">
      <div className="controls">
        <span>Example: </span>
        <select
          value={example.name}
          onChange={(e) => {
            setExample(examples.find((ex) => ex.name === e.currentTarget.value) ?? example);
          }}
        >
          {examples.map((e) => (
            <option key={e.name} value={e.name}>
              {e.name}
            </option>
          ))}
        </select>
      </div>
      <div className="main">
        <div className="example">
          <example.component />
        </div>
        <div className="border" />
        <div className="code">
          <pre>{example.code}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;
