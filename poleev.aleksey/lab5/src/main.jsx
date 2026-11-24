import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
import Board from './components/Board.jsx';

const rootElement = document.querySelector('[data-testid="app"]');

if (!rootElement) {
  throw new Error('Корневой элемент приложения не найден.');
}

createRoot(rootElement).render(
  <StrictMode>
    <Board />
  </StrictMode>,
);
