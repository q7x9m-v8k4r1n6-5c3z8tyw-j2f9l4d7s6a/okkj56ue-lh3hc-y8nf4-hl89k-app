import { useQuery } from '@tanstack/react-query'
import { getPermissions, getRoles } from '../../api/securityRoles.api'
import { securityRolesQueryKeys } from './securityRoles.queryKeys'

/** Owns the server cache for the RBAC role list. */
export const useRolesQuery = () => useQuery({
  queryKey: securityRolesQueryKeys.all,
  queryFn: ({ signal }) => getRoles(signal),
})

/** Owns the reusable permission catalog cache for the role editor. */
export const usePermissionsQuery = () => useQuery({
  queryKey: securityRolesQueryKeys.permissions,
  queryFn: ({ signal }) => getPermissions(signal),
})

