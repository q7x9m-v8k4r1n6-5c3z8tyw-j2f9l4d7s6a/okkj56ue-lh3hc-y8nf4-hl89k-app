import { client } from '@/core/shared/api'
import {
  organizerScoringHistoryResponseSchema,
  type OrganizerScoringHistoryResponse,
} from '../model/organizerScoringHistory.contract'

export const getOrganizerScoringHistory = async (
  raceId: string,
  page = 1,
  pageSize = 50,
  signal?: AbortSignal,
): Promise<OrganizerScoringHistoryResponse> => {
  const response = await client.request<unknown>({
    path: '/Race/scoring-log',
    query: { raceId, page, pageSize },
    signal,
  })

  return organizerScoringHistoryResponseSchema.parse(response)
}
