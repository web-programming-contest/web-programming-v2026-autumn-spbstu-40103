import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import './styles/style.scss';

const root = ReactDOM.createRoot(document.querySelector('body') as HTMLElement);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
