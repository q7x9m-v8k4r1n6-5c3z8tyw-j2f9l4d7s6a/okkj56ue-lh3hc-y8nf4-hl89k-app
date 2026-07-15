import type { z } from 'zod'
import {
  createOrganizerRequestSchema,
  createOrganizerResponseSchema,
  createTeamRequestSchema,
  createTeamResponseSchema,
  organizerDetailResponseSchema,
  teamDetailResponseSchema,
  updateOrganizerRequestSchema,
  updateOrganizerResponseSchema,
  updateTeamRequestSchema,
  updateTeamResponseSchema,
  userFormPropsSchema,
} from './userForm.schema'

export type UserFormProps = z.infer<typeof userFormPropsSchema> & {
  onClose?: () => void
  onSaved?: () => void
}

export type CreateTeamRequest = z.infer<typeof createTeamRequestSchema>
export type CreateOrganizerRequest = z.infer<typeof createOrganizerRequestSchema>
export type UpdateTeamRequest = z.infer<typeof updateTeamRequestSchema>
export type UpdateOrganizerRequest = z.infer<typeof updateOrganizerRequestSchema>
export type TeamDetailResponse = z.infer<typeof teamDetailResponseSchema>
export type OrganizerDetailResponse = z.infer<typeof organizerDetailResponseSchema>
export type CreateTeamResponse = z.infer<typeof createTeamResponseSchema>
export type CreateOrganizerResponse = z.infer<typeof createOrganizerResponseSchema>
export type UpdateTeamResponse = z.infer<typeof updateTeamResponseSchema>
export type UpdateOrganizerResponse = z.infer<typeof updateOrganizerResponseSchema>
