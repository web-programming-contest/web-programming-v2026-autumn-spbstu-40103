import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from '../../context/AuthContext';

// Пока идёт проверка сессии, ничего не показываем, чтобы не мигала страница логина.
// Если пользователь не вошёл, отправляем на /login и запоминаем, куда он шёл.
export default function ProtectedRoute({children}) {
  const {user, loading} = useAuth();
  const location = useLocation();
  if (loading) {
    return null;
  }
  if (!user) {
    return <Navigate to="/login" replace state={{from: location}} />;
  }
  return children;
}
