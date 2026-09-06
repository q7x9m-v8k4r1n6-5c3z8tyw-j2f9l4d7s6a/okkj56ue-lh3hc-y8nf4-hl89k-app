import { useParams } from 'react-router-dom'
import { SCORING_LOG_HISTORY_PAGE_SIZE } from '../../model/scoringLogHistory.constants'
import { useScoringLogHistoryState } from '../../model/frontend/useScoringLogHistoryState'
import { useScoringLogHistoryQuery } from '../../model/server/useScoringLogHistoryQuery'
import { useScoringLogHistorySignalR } from '../../model/server/useScoringLogHistorySignalR'

export const useScoringLogHistory = () => {
  const { raceId } = useParams<{ raceId: string }>()
  useScoringLogHistorySignalR(raceId)

  const query = useScoringLogHistoryQuery(raceId, 1, SCORING_LOG_HISTORY_PAGE_SIZE)
  const state = useScoringLogHistoryState(query.data?.items ?? [])

  return {
    ...state,
    isError: query.isError,
    isLoading: query.isLoading,
    retry: query.refetch,
  }
}
