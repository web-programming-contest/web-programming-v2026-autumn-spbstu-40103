import {useState} from 'react';
import {Link, NavLink} from 'react-router-dom';
import {useStore} from '../../context/Store';
import {asset} from '../../utils/assets';

export function Header() {
  const {authenticated, items, logout} = useStore();
  const [error, setError] = useState('');

  return (
    <>
      <header>
        <nav className="container">
          <Link className="logo" to="/">
            <span>Gadget</span> Hub
          </Link>
          <div className="nav-links">
            <NavLink to="/catalog">Каталог</NavLink>
            {authenticated && (
              <NavLink to="/cart">
                <img src={asset('cart-blue-icon.svg')} alt="" />
                Корзина{' '}
                <span className="badge">
                  {items.reduce((count, item) => count + item.quantity, 0)}
                </span>
              </NavLink>
            )}
            {authenticated ? (
              <button
                onClick={() =>
                  logout().catch((reason) => setError(String(reason)))
                }
              >
                <img src={asset('profile-icon.svg')} alt="" />
                Выйти
              </button>
            ) : (
              <NavLink to="/login">
                <img src={asset('profile-icon.svg')} alt="" />
                Войти
              </NavLink>
            )}
          </div>
        </nav>
      </header>
      {error && <p role="alert">{error}</p>}
    </>
  );
}
