import { client } from '@/core/shared/api/interceptor'
import type {
  CreateOrganizerRequest,
  CreateOrganizerResponse,
  CreateTeamRequest,
  CreateTeamResponse,
  OrganizerDetailResponse,
  TeamDetailResponse,
  UpdateOrganizerRequest,
  UpdateOrganizerResponse,
  UpdateTeamRequest,
  UpdateTeamResponse,
} from '../models'

export const getTeamDetail = async (teamId: number, signal?: AbortSignal): Promise<TeamDetailResponse> => {
  return client.request<TeamDetailResponse>({
    path: `/api/v1/Team/${teamId}`,
    method: 'GET',
    signal,
  })
}

export const getOrganizerDetail = async (organizerId: number, signal?: AbortSignal): Promise<OrganizerDetailResponse> => {
  return client.request<OrganizerDetailResponse>({
    path: `/api/v1/Organizer/${organizerId}`,
    method: 'GET',
    signal,
  })
}

export const createTeam = async (payload: CreateTeamRequest, signal?: AbortSignal): Promise<CreateTeamResponse> => {
  return client.request<CreateTeamResponse, CreateTeamRequest>({
    path: '/api/v1/Team',
    method: 'POST',
    body: payload,
    signal,
  })
}

export const createOrganizer = async (payload: CreateOrganizerRequest, signal?: AbortSignal): Promise<CreateOrganizerResponse> => {
  return client.request<CreateOrganizerResponse, CreateOrganizerRequest>({
    path: '/api/v1/Organizer',
    method: 'POST',
    body: payload,
    signal,
  })
}

export const updateTeam = async (payload: UpdateTeamRequest, signal?: AbortSignal): Promise<UpdateTeamResponse> => {
  return client.request<UpdateTeamResponse, UpdateTeamRequest>({
    path: `/api/v1/Team/${payload.id}`,
    method: 'PUT',
    body: payload,
    signal,
  })
}

export const updateOrganizer = async (payload: UpdateOrganizerRequest, signal?: AbortSignal): Promise<UpdateOrganizerResponse> => {
  return client.request<UpdateOrganizerResponse, UpdateOrganizerRequest>({
    path: `/api/v1/Organizer/${payload.id}`,
    method: 'PUT',
    body: payload,
    signal,
  })
}
