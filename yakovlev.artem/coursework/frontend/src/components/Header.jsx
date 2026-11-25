import {Link, NavLink, useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext.jsx';
import {useCart} from '../context/CartContext.jsx';
import Logo from './Logo.jsx';

export default function Header() {
  const {user, logout} = useAuth();
  const {count} = useCart();
  const navigate = useNavigate();

  const handleAuthClick = async () => {
    if (user) {
      await logout();
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <Logo />
        </Link>
        <nav className="header-nav">
          <NavLink
            to="/catalog"
            className={({isActive}) =>
              `header-link${isActive ? ' header-link-active' : ''}`
            }
          >
            <img
              src="/images/icons/catalog.svg"
              alt=""
              className="header-icon"
            />
            Каталог
          </NavLink>
          {user && (
            <NavLink
              to="/cart"
              className={({isActive}) =>
                `header-link${isActive ? ' header-link-active' : ''}`
              }
            >
              <img
                src="/images/icons/card.svg"
                alt=""
                className="header-icon"
              />
              Корзина
              {count > 0 && <span className="header-badge">{count}</span>}
            </NavLink>
          )}
          <button
            type="button"
            className="header-link header-link-button"
            onClick={handleAuthClick}
          >
            <img
              src="/images/icons/profile.svg"
              alt=""
              className="header-icon"
            />
            {user ? 'Выйти' : 'Войти'}
          </button>
        </nav>
      </div>
    </header>
  );
}
