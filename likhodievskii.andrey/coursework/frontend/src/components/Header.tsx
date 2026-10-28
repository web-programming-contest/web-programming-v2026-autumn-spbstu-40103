import {Link} from 'react-router-dom';

import catalogLogo from '../assets/images/icons/catalog.svg';
import profileLogo from '../assets/images/icons/profile.svg';
import cartLogo from '../assets/images/icons/cart.svg';

import Title from './Title';

function Header({
  isLoggedIn,
  onLogout,
  activeItem,
  setActiveItem,
  cartCount,
}: {
  isLoggedIn: boolean;
  onLogout: () => void;
  activeItem: string;
  setActiveItem: (v: string) => void;
  cartCount: number;
}) {
  function clickLogout() {
    onLogout();
    setActiveItem('home');

    fetch('http://127.0.0.1:8080/logout', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
    }).catch((error) => console.error('Ошибка:', error));
  }

  const homeLink =
    activeItem !== '' ? (
      <Link to="/" onClick={() => setActiveItem('')}>
        <Title />
      </Link>
    ) : (
      <Title />
    );

  return (
    <header>
      <div className="wrapper">
        {homeLink}

        <div className="items">
          <Link
            to="/catalog"
            className={activeItem === 'catalog' ? 'active' : ''}
            onClick={() => setActiveItem('catalog')}
          >
            <div className="item">
              <img src={catalogLogo} alt="catalog-logo" />
              <p>Каталог</p>
            </div>
          </Link>

          {isLoggedIn && (
            <Link
              to="/cart"
              className={activeItem === 'cart' ? 'active' : ''}
              onClick={() => setActiveItem('cart')}
            >
              <div className="item">
                <img src={cartLogo} alt="cart-logo" />
                <p>Корзина</p>
                {isLoggedIn && cartCount !== 0 && (
                  <div className="amount-goods">{cartCount}</div>
                )}
              </div>
            </Link>
          )}

          <Link
            to={isLoggedIn ? '/' : '/profile'}
            className={activeItem === 'profile' ? 'active' : ''}
            onClick={() => {
              if (isLoggedIn) clickLogout();
              setActiveItem('profile');
            }}
          >
            <div className="item">
              <img src={profileLogo} alt="profile-logo" />
              <p>{isLoggedIn ? 'Выйти' : 'Войти'}</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
