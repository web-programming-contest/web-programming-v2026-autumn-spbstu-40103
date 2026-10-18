import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

const root = document.querySelector('[data-testid="app"]');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
