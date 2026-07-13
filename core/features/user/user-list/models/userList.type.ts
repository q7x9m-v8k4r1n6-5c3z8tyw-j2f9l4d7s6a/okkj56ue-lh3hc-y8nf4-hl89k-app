import { z } from 'zod'
import type { ListOrganizersByFilterRequestSchema, ListTeamsByFilterRequestSchema, ListTeamsResponseSchema, OrganizerListResponseSchema } from '../..'

export type ListTeamsResponse = z.infer<typeof ListTeamsResponseSchema>
export type OrganizerListResponse = z.infer<typeof OrganizerListResponseSchema>
export type ListTeamsByFilterRequest = z.infer<typeof ListTeamsByFilterRequestSchema>
export type ListOrganizersByFilterRequest = z.infer<typeof ListOrganizersByFilterRequestSchema>
