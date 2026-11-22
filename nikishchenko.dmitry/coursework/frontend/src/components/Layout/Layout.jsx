import {Outlet, useLocation} from 'react-router-dom';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import styles from './Layout.module.css';

// Фон основной области зависит от страницы (как в макете)
const BACKGROUNDS = {
  '/cart': 'var(--color-bg)',
  '/login': 'var(--color-bg-login)',
};

export default function Layout() {
  const {pathname} = useLocation();
  return (
    <>
      <Header />
      <main className={styles.main} style={{background: BACKGROUNDS[pathname]}}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
