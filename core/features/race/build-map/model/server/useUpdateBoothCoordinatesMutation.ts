import { useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { updateBoothCoordinates } from '../../api/buildMap.api'
import type { UpdateBoothCoordinatesPayload } from '../buildMap.contract'
import { buildMapQueryKeys } from './buildMap.queryKeys'

/**
 * Mutation options factory for updating station coordinates, enabling direct testing and execution.
 */
export const getUpdateBoothCoordinatesMutationOptions = (
  queryClient: QueryClient,
  raceId?: string,
) => ({
  mutationFn: (payload: UpdateBoothCoordinatesPayload) => {
    if (!raceId || !raceId.trim()) {
      throw new Error('Không tìm thấy mã trận đấu.')
    }
    return updateBoothCoordinates(raceId.trim(), payload)
  },
  onSuccess: () => {
    if (raceId?.trim()) {
      void queryClient.invalidateQueries({
        queryKey: buildMapQueryKeys.booths(raceId.trim()),
      })
      void queryClient.invalidateQueries({
        queryKey: buildMapQueryKeys.mapDetail(raceId.trim()),
      })
    }
    void queryClient.invalidateQueries({
      queryKey: buildMapQueryKeys.all,
    })
  },
})

/**
 * React Query mutation hook managing station coordinates update and cache invalidation.
 */
export const useUpdateBoothCoordinatesMutation = (raceId?: string) => {
  const queryClient = useQueryClient()

  return useMutation(getUpdateBoothCoordinatesMutationOptions(queryClient, raceId))
}
