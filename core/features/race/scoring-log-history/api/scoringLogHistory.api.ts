import { client } from '@/core/shared/api'
import {
  scoringLogHistoryResponseSchema,
  type ScoringLogHistoryResponse,
} from '../model/scoringLogHistory.contract'

export const getScoringLogHistory = async (
  raceId: string,
  page: number,
  pageSize: number,
  signal?: AbortSignal,
): Promise<ScoringLogHistoryResponse> => {
  const response = await client.request<unknown>({
    path: '/Race/scoring-log',
    query: { raceId, page, pageSize },
    signal,
  })

  return scoringLogHistoryResponseSchema.parse(response)
}
