import { Navigate, Outlet } from 'react-router-dom'
import { useAuthSession } from '@/core/features/auth'

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthSession()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
