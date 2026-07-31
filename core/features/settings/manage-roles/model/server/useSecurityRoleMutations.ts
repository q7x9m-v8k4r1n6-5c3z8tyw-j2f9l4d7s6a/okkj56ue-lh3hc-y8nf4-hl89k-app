import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  assignPermission,
  createRole,
  deactivateRole,
  removePermission,
  updateRole,
} from '../../api/securityRoles.api'
import type { RoleForm } from '../securityRoles.form'
import { securityRolesQueryKeys } from './securityRoles.queryKeys'

type SaveRoleInput = {
  roleId?: string
  form: RoleForm
  originalPermissionIds: string[]
}

/** Saves role metadata, then reconciles permission assignments with the baseline. */
export const useSaveRoleMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ form, originalPermissionIds, roleId }: SaveRoleInput) => {
      const payload = {
        name: form.name.trim(),
        code: form.code.trim(),
        description: form.description.trim() || null,
      }
      const role = roleId
        ? await updateRole(roleId, payload)
        : await createRole(payload)
      const currentRoleId = role.id
      const previous = new Set(originalPermissionIds)
      const selected = new Set(form.permissionIds)
      const additions = form.permissionIds.filter((id) => !previous.has(id))
      const removals = originalPermissionIds.filter((id) => !selected.has(id))

      await Promise.all([
        ...additions.map((permissionId) => assignPermission(currentRoleId, permissionId)),
        ...removals.map((permissionId) => removePermission(currentRoleId, permissionId)),
      ])
      return role
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: securityRolesQueryKeys.all })
      void queryClient.invalidateQueries({ queryKey: ['rbac', 'roles'] })
    },
  })
}

/** Deactivates a custom role and refreshes every role consumer. */
export const useDeactivateRoleMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deactivateRole,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: securityRolesQueryKeys.all })
      void queryClient.invalidateQueries({ queryKey: ['rbac', 'roles'] })
    },
  })
}
