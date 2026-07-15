import { staffRoleSchema, userCategorySchema, userStatusSchema } from '@/core/entities/user/model'
import { z } from 'zod'

export const userFormModeSchema = z.enum(['create', 'edit'])

export const userFormPropsSchema = z.object({
  category: userCategorySchema,
  mode: userFormModeSchema,
  open: z.boolean().optional(),
  userId: z.union([z.string(), z.number()]).optional(),
})

export const createTeamRequestSchema = z.object({
  displayName: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
  email: z.string().email(),
  status: userStatusSchema,
})

export const createOrganizerRequestSchema = z.object({
  displayName: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
  email: z.string().email(),
  role: staffRoleSchema,
  status: userStatusSchema,
})

export const updateTeamRequestSchema = createTeamRequestSchema.extend({
  id: z.number(),
})

export const updateOrganizerRequestSchema = createOrganizerRequestSchema.extend({
  id: z.number(),
})

export const teamDetailResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  password: z.string().optional(),
  leaderEmail: z.string().email(),
  status: userStatusSchema,
})

export const organizerDetailResponseSchema = z.object({
  id: z.number(),
  displayName: z.string(),
  username: z.string().optional(),
  password: z.string().optional(),
  email: z.string().email(),
  role: staffRoleSchema,
  status: userStatusSchema,
})

export const createTeamResponseSchema = z.object({
  id: z.number(),
})

export const createOrganizerResponseSchema = z.object({
  id: z.number(),
})

export const updateTeamResponseSchema = z.object({
  id: z.number(),
})

export const updateOrganizerResponseSchema = z.object({
  id: z.number(),
})
