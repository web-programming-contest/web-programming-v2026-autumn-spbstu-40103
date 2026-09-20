import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {App} from './App.jsx';
import './styles.css';

const rootElement = document.querySelector('[data-testid="app"]');

if (!rootElement) {
  throw new Error('Корневой элемент приложения не найден.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
