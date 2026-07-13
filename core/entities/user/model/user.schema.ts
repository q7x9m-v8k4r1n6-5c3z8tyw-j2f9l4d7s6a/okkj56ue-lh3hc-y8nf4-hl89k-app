import { z } from 'zod'

export const userCategorySchema = z.enum(['team', 'staff'])
export const userStatusSchema = z.enum(['active', 'inactive'])
export const staffRoleSchema = z.enum(['admin', 'coordinator', 'support'])

export const userModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
})

export const currentUserModelSchema = userModelSchema.extend({
  role: z.string(),
})

export const userRecordSchema = z.object({
  id: z.number(),
  category: userCategorySchema,
  displayName: z.string(),
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  role: z.union([staffRoleSchema, z.literal('')]),
  status: userStatusSchema,
  inviteEmail: z.boolean(),
  note: z.string(),
})

export const userTableRowModelSchema = userRecordSchema.pick({
  category: true,
  displayName: true,
  email: true,
  id: true,
  status: true,
  username: true,
})
