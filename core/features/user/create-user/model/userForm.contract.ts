import { z } from 'zod'
import { userStatusSchema } from '@/core/entities/user'

const accountFieldsSchema = z.object({
  displayName: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
  email: z.string().email(),
  status: userStatusSchema,
})

export const createTeamRequestSchema = accountFieldsSchema.pick({
  displayName: true,
  email: true,
})
export const createOrganizerRequestSchema = accountFieldsSchema.extend({
  roleIds: z.array(z.string().uuid()).min(1),
})
export const updateTeamRequestSchema = accountFieldsSchema.extend({
  id: z.string().min(1),
  resetPassword: z.boolean().optional(),
})
export const updateOrganizerRequestSchema = createOrganizerRequestSchema.extend({
  id: z.string().min(1),
})

export const teamDetailResponseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  username: z.string().min(1),
  password: z.string().optional(),
  leaderEmail: z.string().email(),
  status: userStatusSchema,
})
export const organizerDetailResponseSchema = z.object({
  id: z.string().min(1),
  displayName: z.string().min(1),
  username: z.string().optional(),
  password: z.string().optional(),
  email: z.string().email(),
  role: z.string(),
  roleIds: z.array(z.string().uuid()).default([]),
  status: userStatusSchema,
})
export const saveUserResponseSchema = z.object({
  id: z.string().min(1),
})

export type CreateTeamRequest = z.infer<typeof createTeamRequestSchema>
export type CreateOrganizerRequest =
  z.infer<typeof createOrganizerRequestSchema>
export type UpdateTeamRequest = z.infer<typeof updateTeamRequestSchema>
export type UpdateOrganizerRequest =
  z.infer<typeof updateOrganizerRequestSchema>
export type TeamDetailResponse = z.infer<typeof teamDetailResponseSchema>
export type OrganizerDetailResponse =
  z.infer<typeof organizerDetailResponseSchema>
export type SaveUserResponse = z.infer<typeof saveUserResponseSchema>
