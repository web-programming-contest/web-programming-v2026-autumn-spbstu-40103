import {Link} from 'react-router-dom';
import {usePageTitle} from '../hooks/usePageTitle';

export default function NotFound() {
  usePageTitle('Страница не найдена');
  return (
    <div className="container" style={{padding: '48px 0'}}>
      <h1 style={{fontSize: 'var(--fs-32)', fontWeight: 500}}>
        Страница не найдена
      </h1>
      <p style={{marginTop: 16}}>
        <Link to="/">Вернуться на главную</Link>
      </p>
    </div>
  );
}
