import {Link} from 'react-router-dom';

import Title from '../components/Title';

import '../styles/nonFoundStyle.scss';

function NotFoundPage() {
  return (
    <div className="not-found-page">
      <Title />

      <h1>404</h1>
      <h2>Такой страницы нет 😥</h2>

      <Link to="/" className="home-link">
        Вернуться на главную
      </Link>
    </div>
  );
}

export default NotFoundPage;
