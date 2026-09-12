import {Link, NavLink, Outlet} from 'react-router-dom';
import {useState} from 'react';
import {useStore} from '../context/Store';
import {asset} from '../api';

export function Layout() {
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
                  {items.reduce((n, i) => n + i.quantity, 0)}
                </span>
              </NavLink>
            )}
            {authenticated ? (
              <button
                onClick={() => {
                  logout().catch((err) => setError(String(err)));
                }}
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
      <Outlet />
      <footer>
        <div className="container footer-grid">
          <div>
            <Link className="logo" to="/">
              Gadget Hub
            </Link>
            <p>Магазин надежных гаджетов</p>
          </div>
          <a className="footer-phone" href="tel:88006783424">
            <img src={asset('phone-icon.svg')} alt="" />8 (800) 678-34-24
          </a>
          <div className="socials">
            {[
              ['VK', 'https://vk.com', 'vk'],
              ['Telegram', 'https://t.me', 'tg'],
              ['WhatsApp', 'https://wa.me', 'wa'],
            ].map(([name, url, file]) => (
              <a href={url} key={name} aria-label={name}>
                <img src={asset(`social-${file}.png`)} alt={name} />
              </a>
            ))}
          </div>
          <p className="copyright">
            © 2024 ООО «Гаджет Хаб». Все права защищены
          </p>
        </div>
      </footer>
    </>
  );
}
