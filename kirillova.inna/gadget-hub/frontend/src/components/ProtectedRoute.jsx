import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from '../hooks/AuthContext.jsx';

function ProtectedRoute({children}) {
  const {isAuthenticated, isLoading} = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{from: location}} replace />;
  }

  return children;
}

export default ProtectedRoute;
