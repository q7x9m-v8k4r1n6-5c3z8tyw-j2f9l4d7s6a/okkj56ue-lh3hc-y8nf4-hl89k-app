import { z } from 'zod'
import { userStatusSchema } from '@/core/entities/user'

const pageRequestSchema = z.object({
  search: z.string().optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(100).optional(),
})

export const listTeamsRequestSchema = pageRequestSchema
export const listOrganizersRequestSchema = pageRequestSchema

export const teamManagementRowSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  username: z.string().min(1),
  status: userStatusSchema,
  leaderEmail: z.string().email(),
})
export const organizerManagementRowSchema = z.object({
  id: z.string().min(1),
  displayName: z.string().min(1),
  email: z.string().email(),
  role: z.string(),
  status: userStatusSchema,
})

const createPageSchema = <Item extends z.ZodType>(itemSchema: Item) => z.object({
  items: z.array(itemSchema),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
})

export const listTeamsResponseSchema = createPageSchema(teamManagementRowSchema)
export const listOrganizersResponseSchema =
  createPageSchema(organizerManagementRowSchema)

export type ListTeamsRequest = z.infer<typeof listTeamsRequestSchema>
export type ListOrganizersRequest = z.infer<typeof listOrganizersRequestSchema>
export type ListTeamsResponse = z.infer<typeof listTeamsResponseSchema>
export type ListOrganizersResponse =
  z.infer<typeof listOrganizersResponseSchema>
