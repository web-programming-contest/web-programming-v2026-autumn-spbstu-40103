import {Link, NavLink, Outlet, useNavigate} from 'react-router-dom';
import {useStore} from '../context/StoreContext.jsx';

function navClass({isActive}) {
  return `nav-link ${isActive ? 'active' : ''}`;
}

export default function Layout() {
  const {user, logout, cartCount} = useStore();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/" aria-label="На главную">
            <img src="/assets/logo.svg" alt="Gadget Hub" />
          </Link>
          <nav className="main-nav" aria-label="Основная навигация">
            <NavLink className={navClass} to="/catalog">
              <img
                className="nav-icon"
                src="/assets/icons/catalog.svg"
                alt=""
              />
              Каталог
            </NavLink>
            {user ? (
              <>
                <NavLink className={navClass} to="/cart">
                  <img
                    className="nav-icon"
                    src="/assets/icons/card.svg"
                    alt=""
                  />
                  Корзина
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                  )}
                </NavLink>
                <span className="user-name">{user.name}</span>
                <button
                  className="nav-link nav-button"
                  type="button"
                  onClick={handleLogout}
                >
                  <img
                    className="nav-icon"
                    src="/assets/icons/profile.svg"
                    alt=""
                  />
                  Выйти
                </button>
              </>
            ) : (
              <NavLink className={navClass} to="/login">
                <img
                  className="nav-icon"
                  src="/assets/icons/profile.svg"
                  alt=""
                />
                Войти
              </NavLink>
            )}
          </nav>
        </div>
      </header>
      <main id="main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <Link className="footer-brand" to="/">
              <img src="/assets/logo.svg" alt="Gadget Hub" />
            </Link>
            <p>Технологии, которые делают жизнь удобнее.</p>
          </div>
          <div className="footer-contacts">
            <span>Связаться с нами</span>
            <a href="tel:+78006783424">8 (800) 678-34-24</a>
          </div>
          <div className="socials">
            <a href="#" aria-label="ВКонтакте">
              <img src="/assets/social/vk.png" alt="" />
            </a>
            <a href="#" aria-label="Telegram">
              <img src="/assets/social/telegram.png" alt="" />
            </a>
            <a href="#" aria-label="WhatsApp">
              <img src="/assets/social/whatsapp.png" alt="" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
