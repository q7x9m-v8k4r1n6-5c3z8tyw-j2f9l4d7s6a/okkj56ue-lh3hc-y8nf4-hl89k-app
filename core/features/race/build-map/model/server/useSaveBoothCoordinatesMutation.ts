import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateBoothCoordinates } from '../../api/buildMap.api'
import type { UpdateBoothCoordinatesPayload } from '../buildMap.contract'
import { buildMapQueryKeys } from './buildMap.queryKeys'

export interface SaveBoothCoordinatesVariables {
  payload: UpdateBoothCoordinatesPayload
}

/**
 * Mutation hook to persist all booth coordinates to the database.
 * Endpoint: PUT /api/v1/Race/{raceId}/booths/coordinates
 */
export const useSaveBoothCoordinatesMutation = (raceId?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ payload }: SaveBoothCoordinatesVariables) => {
      if (!raceId) throw new Error('Không tìm thấy mã trận đấu.')
      return updateBoothCoordinates(raceId, payload)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: buildMapQueryKeys.booths(raceId),
      })
      void queryClient.invalidateQueries({
        queryKey: buildMapQueryKeys.all,
      })
      void queryClient.invalidateQueries({
        queryKey: ['races'],
      })
      void queryClient.invalidateQueries({
        queryKey: ['edit-race'],
      })
    },
  })
}
