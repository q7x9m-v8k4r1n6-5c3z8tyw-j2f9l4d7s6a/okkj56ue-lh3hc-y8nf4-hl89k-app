import { useParams } from 'react-router-dom'
import { mapOrganizerScoringHistoryItem } from '../../model/organizerScoringHistory.presentation'
import { useOrganizerScoringHistoryQuery } from '../../model/server/useOrganizerScoringHistoryQuery'

export const useOrganizerScoringHistory = () => {
  const { raceId } = useParams<{ raceId: string }>()
  const query = useOrganizerScoringHistoryQuery(raceId)

  return {
    items: (query.data?.items ?? []).map(mapOrganizerScoringHistoryItem),
    isError: query.isError,
    isLoading: query.isLoading,
    retry: query.refetch,
  }
}
