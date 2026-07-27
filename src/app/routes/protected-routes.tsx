import { Navigate, Outlet } from 'react-router-dom'
import { useAuthSession } from '@/core/features/auth'

const isTeamRole = (role?: string) => role?.toLowerCase() === 'team'

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthSession()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export const AdminRoute = () => {
  const { user } = useAuthSession()

  if (isTeamRole(user?.role)) {
    return <Navigate to="/team" replace />
  }

  return <Outlet />
}

export const TeamRoute = () => {
  const { user } = useAuthSession()

  if (!isTeamRole(user?.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
