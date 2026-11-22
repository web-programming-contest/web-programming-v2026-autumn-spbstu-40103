import {Route, Routes} from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Cart from './pages/Cart';
import Catalog from './pages/Catalog';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Каталог и корзина доступны только после входа */}
        <Route
          path="/catalog"
          element={
            <ProtectedRoute>
              <Catalog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
