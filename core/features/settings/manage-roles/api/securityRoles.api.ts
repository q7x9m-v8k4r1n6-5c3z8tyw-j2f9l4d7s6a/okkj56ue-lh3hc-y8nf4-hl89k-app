import { z } from 'zod'
import { client } from '@/core/shared/api'
import {
  permissionResponseSchema,
  rolePermissionAssignmentResponseSchema,
  roleResponseSchema,
  upsertRoleRequestSchema,
  type PermissionResponse,
  type RoleResponse,
  type UpsertRoleRequest,
} from '../model/securityRoles.contract'

/** Loads all active roles and their permission assignments. */
export const getRoles = async (signal?: AbortSignal): Promise<RoleResponse[]> => {
  const response = await client.request<unknown>({
    path: '/admin/rbac/roles',
    signal,
  })
  return z.array(roleResponseSchema).parse(response)
}

/** Loads the permission catalog used to compose roles. */
export const getPermissions = async (signal?: AbortSignal): Promise<PermissionResponse[]> => {
  const response = await client.request<unknown>({
    path: '/admin/rbac/permissions',
    signal,
  })
  return z.array(permissionResponseSchema).parse(response)
}

export const createRole = async (request: UpsertRoleRequest): Promise<RoleResponse> => {
  const body = upsertRoleRequestSchema.parse(request)
  const response = await client.request<unknown, UpsertRoleRequest>({
    path: '/admin/rbac/roles',
    method: 'POST',
    body,
  })
  return roleResponseSchema.parse(response)
}

export const updateRole = async (
  roleId: string,
  request: UpsertRoleRequest,
): Promise<RoleResponse> => {
  const body = upsertRoleRequestSchema.parse(request)
  const response = await client.request<unknown, UpsertRoleRequest>({
    path: `/admin/rbac/roles/${roleId}`,
    method: 'PUT',
    body,
  })
  return roleResponseSchema.parse(response)
}

export const deactivateRole = async (roleId: string): Promise<boolean> => {
  const response = await client.request<unknown>({
    path: `/admin/rbac/roles/${roleId}`,
    method: 'DELETE',
  })
  return z.boolean().parse(response)
}

export const assignPermission = async (
  roleId: string,
  permissionId: string,
): Promise<void> => {
  const response = await client.request<unknown>({
    path: `/admin/rbac/assignments/roles/${roleId}/permissions/${permissionId}`,
    method: 'POST',
  })
  rolePermissionAssignmentResponseSchema.parse(response)
}

export const removePermission = async (
  roleId: string,
  permissionId: string,
): Promise<void> => {
  const response = await client.request<unknown>({
    path: `/admin/rbac/assignments/roles/${roleId}/permissions/${permissionId}`,
    method: 'DELETE',
  })
  z.boolean().parse(response)
}

