import {Outlet} from 'react-router-dom';
import {Footer} from './layout/Footer';
import {Header} from './layout/Header';

export function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
