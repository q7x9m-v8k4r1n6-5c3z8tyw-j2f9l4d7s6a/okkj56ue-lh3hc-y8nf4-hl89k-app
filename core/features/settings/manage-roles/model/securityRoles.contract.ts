import { z } from 'zod'

export const roleResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  code: z.string(),
  description: z.string().nullish(),
  isSystem: z.boolean(),
  createdAt: z.string(),
  modifiedAt: z.string(),
  permissionCount: z.number().int().nonnegative(),
  permissionIds: z.array(z.string().uuid()),
})

export const permissionResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  code: z.string(),
  description: z.string().nullish(),
  module: z.string(),
  action: z.string(),
  isSystem: z.boolean(),
})

export const upsertRoleRequestSchema = z.object({
  name: z.string().trim().min(1).max(100),
  code: z.string().trim().min(1).max(100),
  description: z.string().trim().max(500).nullable(),
})

export const rolePermissionAssignmentResponseSchema = z.object({
  roleId: z.string().uuid(),
  permissionId: z.string().uuid(),
})

export type RoleResponse = z.infer<typeof roleResponseSchema>
export type PermissionResponse = z.infer<typeof permissionResponseSchema>
export type UpsertRoleRequest = z.infer<typeof upsertRoleRequestSchema>
