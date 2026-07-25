import { client } from '@/core/shared/api/interceptor'
import type { UserStatus } from '@/core/entities/user/model'

export interface CreateTeamRequest {
  displayName: string
  username: string
  password?: string
  email: string
  status: UserStatus
}

export interface CreateTeamResponse {
  id: number
}

export interface UpdateTeamRequest extends CreateTeamRequest {
  id: number
}

export interface UpdateTeamResponse {
  id: number
}

export const createTeam = async (payload: CreateTeamRequest, signal?: AbortSignal): Promise<CreateTeamResponse> => {
  return client.request<CreateTeamResponse, CreateTeamRequest>({
    path: '/Team',
    method: 'POST',
    body: payload,
    signal,
  })
}

export const updateTeam = async (payload: UpdateTeamRequest, signal?: AbortSignal): Promise<UpdateTeamResponse> => {
  return client.request<UpdateTeamResponse, UpdateTeamRequest>({
    path: `/Team/${payload.id}`,
    method: 'PUT',
    body: payload,
    signal,
  })
}
