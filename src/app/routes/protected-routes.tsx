import { Navigate, Outlet } from 'react-router-dom'
import { useAuthSession } from '@/core/features/auth'

const isTeamRole = (role?: string) => role?.toLowerCase() === 'team'
const isOrganizerRole = (role?: string) => role?.toLowerCase() === 'organizer'
const isAdminRole = (role?: string) => role?.toLowerCase() === 'admin'

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
  if (isOrganizerRole(user?.role)) {
    return <Navigate to="/organizer" replace />
  }
  if (!isAdminRole(user?.role)) {
    return <Navigate to="/login" replace />
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

export const OrganizerRoute = () => {
  const { user } = useAuthSession()

  if (!isOrganizerRole(user?.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
