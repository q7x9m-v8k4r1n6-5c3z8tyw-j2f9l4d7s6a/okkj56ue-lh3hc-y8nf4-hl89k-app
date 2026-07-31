import { z } from 'zod'
import { client } from '@/core/shared/api'
import {
  organizerSummarySchema,
  type OrganizerSummary,
} from '../model/organizer'

const pagedOrganizersSchema = z.object({
  items: z.array(organizerSummarySchema),
  page: z.number(),
  pageSize: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
})

/**
 * Fetches and validates organizer summaries for reusable selection UI.
 */
export const getOrganizers = async (
  searchQuery: string,
  signal?: AbortSignal,
): Promise<OrganizerSummary[]> => {
  const query = searchQuery.trim()
  if (query) {
    const response = await client.request<unknown>({
      path: '/api/v1/Organizer/search',
      query: { query },
      signal,
    })
    return z.array(organizerSummarySchema).parse(response)
  }

  const response = await client.request<unknown>({
    path: '/api/v1/Organizer',
    query: { page: 1, pageSize: 20 },
    signal,
  })
  return pagedOrganizersSchema.parse(response).items
}
