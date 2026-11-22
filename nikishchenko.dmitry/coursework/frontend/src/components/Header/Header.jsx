import {useEffect, useState} from 'react';
import {Link, NavLink, useNavigate} from 'react-router-dom';
import {useAuth} from '../../context/AuthContext';
import {useCart} from '../../context/CartContext';
import {CartIcon, CatalogIcon, UserIcon} from '../../icons';
import styles from './Header.module.css';

// NavLink сам добавляет класс "active" на текущем разделе
const navClass = ({isActive}) =>
  `${styles.item} ${isActive ? styles.active : ''}`;

export default function Header() {
  const {user, logout} = useAuth();
  const {count} = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Тень под шапкой появляется, когда страница прокручена (вариант "Header (scroll)" из макета)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <Link
          to="/"
          className={styles.logo}
          aria-label="Gadget Hub — на главную"
        >
          <img src="/images/logo.svg" alt="" width="139" height="24" />
        </Link>

        <nav className={styles.nav} aria-label="Основная навигация">
          <NavLink to="/catalog" className={navClass}>
            <CatalogIcon /> Каталог
          </NavLink>

          {user ? (
            <>
              <NavLink to="/cart" className={navClass}>
                <CartIcon /> Корзина
                {count > 0 && (
                  <span
                    className={styles.badge}
                    aria-label={`Товаров в корзине: ${count}`}
                  >
                    {count}
                  </span>
                )}
              </NavLink>
              <button
                type="button"
                className={styles.item}
                onClick={handleLogout}
              >
                <UserIcon /> Выйти
              </button>
            </>
          ) : (
            <NavLink to="/login" className={navClass}>
              <UserIcon /> Войти
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
