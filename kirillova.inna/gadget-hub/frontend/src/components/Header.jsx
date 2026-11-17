import {Link, useLocation, useNavigate} from 'react-router-dom';
import Logo from './Logo.jsx';
import {useAuth} from '../hooks/AuthContext.jsx';
import {useCart} from '../hooks/CartContext.jsx';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const {isAuthenticated, logout} = useAuth();
  const {totalCount} = useCart();

  const isCatalogActive = location.pathname === '/catalog';
  const isCartActive = location.pathname === '/cart';
  const isLoginActive = location.pathname === '/login';

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <header className="header">
      <div className="container header__inner">
        <Logo />
        <nav className="header__nav">
          <Link
            to="/catalog"
            className={`header__link ${isCatalogActive ? 'header__link--active' : ''}`}
          >
            <img
              src="/images/icons/catalog.svg"
              alt=""
              className="header__icon"
            />
            Каталог
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/cart"
                className={`header__link ${isCartActive ? 'header__link--active' : ''}`}
              >
                <img
                  src="/images/icons/card.svg"
                  alt=""
                  className="header__icon"
                />
                Корзина
                {totalCount > 0 && (
                  <span className="header__badge">{totalCount}</span>
                )}
              </Link>
              <button
                type="button"
                className="header__link header__link--button"
                onClick={handleLogout}
              >
                <img
                  src="/images/icons/profile.svg"
                  alt=""
                  className="header__icon"
                />
                Выйти
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={`header__link ${isLoginActive ? 'header__link--active' : ''}`}
            >
              <img
                src="/images/icons/profile.svg"
                alt=""
                className="header__icon"
              />
              Войти
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
