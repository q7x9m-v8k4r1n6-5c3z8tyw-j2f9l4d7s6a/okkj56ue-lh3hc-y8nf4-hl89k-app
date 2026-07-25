import type { OrganizerModel } from '../models'
import { client } from '@core/shared/api/interceptor'
import type { StaffRole, UserStatus } from '@/core/entities/user/model'

export interface OrganizerDetailResponse {
  id: number
  displayName: string
  username?: string
  password?: string
  email: string
  role: StaffRole
  status: UserStatus
}

/**
 * Get organizers from the API (mock data)
 * @returns organizers list
 */
export const getOrganizers = async (): Promise<OrganizerModel[]> => {
  return client.request<OrganizerModel[]>({
    path: '/Organizer',
    method: 'GET',
  })
}

export const getOrganizerDetail = async (organizerId: number, signal?: AbortSignal): Promise<OrganizerDetailResponse> => {
  return client.request<OrganizerDetailResponse>({
    path: `/Organizer/${organizerId}`,
    method: 'GET',
    signal,
  })
}
