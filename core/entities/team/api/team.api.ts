import { z } from 'zod'
import { client } from '@/core/shared/api'
import {
  teamSummarySchema,
  type TeamSummary,
} from '../model/team'

const pagedTeamsSchema = z.object({
  items: z.array(teamSummarySchema),
  page: z.number(),
  pageSize: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
})

/**
 * Fetches and validates team summaries for reusable selection UI.
 */
export const getTeams = async (
  searchQuery: string,
  signal?: AbortSignal,
): Promise<TeamSummary[]> => {
  const query = searchQuery.trim()
  if (query) {
    const response = await client.request<unknown>({
      path: '/Team/search',
      query: { query },
      signal,
    })
    return z.array(teamSummarySchema).parse(response)
  }

  const response = await client.request<unknown>({
    path: '/Team',
    query: { page: 1, pageSize: 20 },
    signal,
  })
  return pagedTeamsSchema.parse(response).items
}
