import { client } from '@/core/shared/api/interceptor'
import type { StaffRole, UserStatus } from '@/core/entities/user/model'

export interface CreateOrganizerRequest {
  displayName: string
  username: string
  password?: string
  email: string
  role: StaffRole
  status: UserStatus
}

export interface CreateOrganizerResponse {
  id: number
}

export interface UpdateOrganizerRequest extends CreateOrganizerRequest {
  id: number
}

export interface UpdateOrganizerResponse {
  id: number
}

export const createOrganizer = async (payload: CreateOrganizerRequest, signal?: AbortSignal): Promise<CreateOrganizerResponse> => {
  return client.request<CreateOrganizerResponse, CreateOrganizerRequest>({
    path: '/Organizer',
    method: 'POST',
    body: payload,
    signal,
  })
}

export const updateOrganizer = async (payload: UpdateOrganizerRequest, signal?: AbortSignal): Promise<UpdateOrganizerResponse> => {
  return client.request<UpdateOrganizerResponse, UpdateOrganizerRequest>({
    path: `/Organizer/${payload.id}`,
    method: 'PUT',
    body: payload,
    signal,
  })
}
