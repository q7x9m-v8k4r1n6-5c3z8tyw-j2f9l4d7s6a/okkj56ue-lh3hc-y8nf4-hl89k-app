import { useQuery } from '@tanstack/react-query'
import { getRaceDetail } from '../../api/editRace.api'
import { mapRaceDetailToForm } from '../mapRaceDetailToForm'
import { editRaceQueryKeys } from './editRace.queryKeys'

/**
 * Loads race detail server state and maps it into the frontend form model.
 */
export const useRaceDetailQuery = (raceId?: string) =>
  useQuery({
    queryKey: editRaceQueryKeys.detail(raceId),
    queryFn: ({ signal }) => getRaceDetail(raceId ?? '', signal),
    select: mapRaceDetailToForm,
    enabled: Boolean(raceId),
    retry: false,
  })
