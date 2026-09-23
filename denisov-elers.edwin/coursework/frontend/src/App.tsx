import {Link, Navigate, Outlet, Route, Routes} from 'react-router-dom';
import {Layout} from './components/Layout';
import {useStore} from './context/Store';
import {Cart} from './pages/Cart';
import {Catalog} from './pages/Catalog';
import {Home} from './pages/Home';
import {Login} from './pages/Login';

function Protected() {
  return useStore().authenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
}

export function App() {
  const {loading, error} = useStore();

  if (loading) {
    return (
      <p className="container" role="status">
        Загрузка Gadget Hub...
      </p>
    );
  }
  if (error) {
    return (
      <main className="container">
        <h1>Не удалось загрузить магазин</h1>
        <p role="alert">{error}</p>
        <button onClick={() => window.location.reload()}>
          Попробовать снова
        </button>
      </main>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route element={<Protected />}>
          <Route path="catalog" element={<Catalog />} />
          <Route path="cart" element={<Cart />} />
        </Route>
        <Route
          path="*"
          element={
            <main className="container">
              <h1>Страница не найдена</h1>
              <Link to="/">На главную</Link>
            </main>
          }
        />
      </Route>
    </Routes>
  );
}
