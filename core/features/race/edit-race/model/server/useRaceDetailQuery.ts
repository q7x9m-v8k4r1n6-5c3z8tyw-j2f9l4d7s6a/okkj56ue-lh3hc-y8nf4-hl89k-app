import { useQuery } from '@tanstack/react-query'
import { getRaceDetail, getRaceRules } from '../../api/editRace.api'
import { mapRaceDetailToForm } from '../mapRaceDetailToForm'
import { editRaceQueryKeys } from './editRace.queryKeys'

/**
 * Loads race detail and rules server state in parallel, combined into the
 * frontend form model only once both requests have succeeded.
 */
export const useRaceDetailQuery = (raceId?: string) => {
  const detailQuery = useQuery({
    queryKey: editRaceQueryKeys.detail(raceId),
    queryFn: ({ signal }) => getRaceDetail(raceId ?? '', signal),
    enabled: Boolean(raceId),
    retry: false,
  })

  const rulesQuery = useQuery({
    queryKey: editRaceQueryKeys.rules(raceId),
    queryFn: ({ signal }) => getRaceRules(raceId ?? '', signal),
    enabled: Boolean(raceId),
    retry: false,
  })

  return {
    data: detailQuery.data
      ? mapRaceDetailToForm(detailQuery.data, rulesQuery.data?.rules ?? '')
      : undefined,
    isLoading: detailQuery.isLoading || rulesQuery.isLoading,
    isError: detailQuery.isError || rulesQuery.isError,
    error: detailQuery.error ?? rulesQuery.error,
  }
}