import type { OrganizerModel } from '../models'
import { client } from '@core/shared/api/interceptor'

/**
 * Get organizers from the API (mock data)
 * @returns organizers list
 */
export const getOrganizers = async (): Promise<OrganizerModel[]> => {
return client.request<OrganizerModel[]>({
    path: '/api/v1/Organizer', 
    method: 'GET',
  })
}

