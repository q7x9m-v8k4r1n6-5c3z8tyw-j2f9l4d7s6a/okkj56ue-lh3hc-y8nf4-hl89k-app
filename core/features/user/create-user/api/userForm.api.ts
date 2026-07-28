import { client } from '@/core/shared/api'
import {
  createOrganizerRequestSchema,
  createTeamRequestSchema,
  organizerDetailResponseSchema,
  saveUserResponseSchema,
  teamDetailResponseSchema,
  updateOrganizerRequestSchema,
  updateTeamRequestSchema,
  type CreateOrganizerRequest,
  type CreateTeamRequest,
  type OrganizerDetailResponse,
  type SaveUserResponse,
  type TeamDetailResponse,
  type UpdateOrganizerRequest,
  type UpdateTeamRequest,
} from '../model/userForm.contract'

/** Fetches and validates one team detail for editing. */
export const getTeamDetail = async (
  teamId: string,
  signal?: AbortSignal,
): Promise<TeamDetailResponse> => {
  const response = await client.request<unknown>({
    path: `/Team/${teamId}`,
    signal,
  })
  return teamDetailResponseSchema.parse(response)
}

/** Fetches and validates one organizer detail for editing. */
export const getOrganizerDetail = async (
  organizerId: string,
  signal?: AbortSignal,
): Promise<OrganizerDetailResponse> => {
  const response = await client.request<unknown>({
    path: `/Organizer/${organizerId}`,
    signal,
  })
  return organizerDetailResponseSchema.parse(response)
}

/** Creates a team after validating the outgoing and incoming contracts. */
export const createTeam = async (
  request: CreateTeamRequest,
): Promise<SaveUserResponse> => {
  const body = createTeamRequestSchema.parse(request)
  const response = await client.request<unknown, CreateTeamRequest>({
    path: '/Team',
    method: 'POST',
    body,
  })
  return saveUserResponseSchema.parse(response)
}

/** Creates an organizer after validating both API boundaries. */
export const createOrganizer = async (
  request: CreateOrganizerRequest,
): Promise<SaveUserResponse> => {
  const body = createOrganizerRequestSchema.parse(request)
  const response = await client.request<unknown, CreateOrganizerRequest>({
    path: '/admin/organizers',
    method: 'POST',
    body,
  })
  return saveUserResponseSchema.parse(response)
}

/** Updates a team after validating both API boundaries. */
export const updateTeam = async (
  request: UpdateTeamRequest,
): Promise<SaveUserResponse> => {
  const body = updateTeamRequestSchema.parse(request)
  const response = await client.request<unknown, UpdateTeamRequest>({
    path: `/Team/${body.id}`,
    method: 'PUT',
    body,
  })
  return saveUserResponseSchema.parse(response)
}

/** Immediately issues a new server-generated password for a team account. */
export const resetTeamPassword = async (teamId: string): Promise<void> => {
  await client.request<unknown>({
    path: `/Team/${teamId}/reset-password`,
    method: 'POST',
  })
}

/** Updates an organizer after validating both API boundaries. */
export const updateOrganizer = async (
  request: UpdateOrganizerRequest,
): Promise<SaveUserResponse> => {
  const body = updateOrganizerRequestSchema.parse(request)
  const response = await client.request<unknown, UpdateOrganizerRequest>({
    path: `/Organizer/${body.id}`,
    method: 'PUT',
    body,
  })
  return saveUserResponseSchema.parse(response)
}
