import { Navigate, Outlet } from 'react-router-dom'
import { useAuthSession } from '@/core/features/auth'

const isTeamUser = (userType?: string) => userType?.toLowerCase() === 'team'
const isOrganizerUser = (userType?: string) => userType?.toLowerCase() === 'organizer'
const hasAdminRole = (roles: readonly string[] = []) => (
  roles.some((role) => role.toLowerCase() === 'admin')
)
const hasAdminAccess = (
  roles: readonly string[] = [],
  permissions: readonly string[] = [],
) => (
  hasAdminRole(roles) ||
  permissions.some((permission) => permission.toLowerCase() === 'race.manage')
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
  if (!hasAdminAccess(user?.roles, user?.permissions)) {
    if (isOrganizerUser(user?.userType)) {
      return <Navigate to="/organizer/select" replace />
    }

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
