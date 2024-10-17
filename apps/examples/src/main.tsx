import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { WithStore } from './WithStore/WithStore';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WithStore>
      <App />
    </WithStore>
  </StrictMode>,
);
