import { Navigate, Outlet } from 'react-router-dom'
import { useAuthSession } from '@/core/features/auth'

const isTeamUser = (userType?: string) => userType?.toLowerCase() === 'team'
const isOrganizerUser = (userType?: string) => userType?.toLowerCase() === 'organizer'
const hasAdminRole = (roles: readonly string[] = []) => (
  roles.some((role) => role.toLowerCase() === 'admin')
)

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthSession()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export const AdminRoute = () => {
  const { user } = useAuthSession()

  if (isTeamUser(user?.userType)) {
    return <Navigate to="/team" replace />
  }
  if (isOrganizerUser(user?.userType) && !hasAdminRole(user?.roles)) {
    return <Navigate to="/organizer" replace />
  }
  if (!hasAdminRole(user?.roles)) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export const TeamRoute = () => {
  const { user } = useAuthSession()

  if (!isTeamUser(user?.userType)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export const OrganizerRoute = () => {
  const { user } = useAuthSession()

  if (!isOrganizerUser(user?.userType)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
