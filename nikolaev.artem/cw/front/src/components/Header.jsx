import {useEffect, useState} from 'react'
import {NavLink, useNavigate} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'
import {useCart} from '../context/CartContext'
import './Header.css'

function NavItem({to, icon, children, ...rest}) {
  return (
    <NavLink to={to} className={({isActive}) => `header__link ${isActive ? 'header__link--active' : ''}`} {...rest}>
      <span className={`header__icon header__icon--${icon}`} aria-hidden="true" />
      {children}
    </NavLink>
  )
}

export default function Header() {
  const {isAuthenticated, logout} = useAuth()
  const {totalCount} = useCart()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    onScroll()
    window.addEventListener('scroll', onScroll, {passive: true})
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
        <NavLink to="/" className="header__logo" end>
          <span>Gadget</span> Hub
        </NavLink>

        <nav className="header__nav">
          <NavItem to="/catalog" icon="catalog">
            Каталог
          </NavItem>

          {isAuthenticated && (
            <NavItem to="/cart" icon="cart">
              Корзина
              {totalCount > 0 && <span className="header__badge">{totalCount}</span>}
            </NavItem>
          )}

          {isAuthenticated ? (
            <button type="button" className="header__link" onClick={handleLogout}>
              <span className="header__icon header__icon--profile" aria-hidden="true" />
              Выйти
            </button>
          ) : (
            <NavItem to="/login" icon="profile">
              Войти
            </NavItem>
          )}
        </nav>
      </div>
    </header>
  )
}
