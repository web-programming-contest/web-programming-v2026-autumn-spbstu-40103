import {Navigate, useLocation} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'

export default function ProtectedRoute({children}) {
  const {isAuthenticated, isLoading} = useAuth()
  const location = useLocation()

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{from: location}} />
  }

  return children
}
