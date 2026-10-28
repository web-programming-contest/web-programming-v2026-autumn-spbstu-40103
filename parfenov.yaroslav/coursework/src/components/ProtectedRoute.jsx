import {Navigate, useLocation} from 'react-router-dom';
import {useStore} from '../context/StoreContext.jsx';

export default function ProtectedRoute({children}) {
  const {user} = useStore();
  const location = useLocation();
  return user ? (
    children
  ) : (
    <Navigate to="/login" replace state={{from: location.pathname}} />
  );
}
