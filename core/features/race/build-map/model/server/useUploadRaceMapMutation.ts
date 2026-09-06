import { useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { uploadRaceMap } from '../../api/buildMap.api'
import type { RaceMapDetailResponse, UploadRaceMapResponse } from '../buildMap.contract'
import { buildMapQueryKeys } from './buildMap.queryKeys'

/**
 * Mutation options factory for race map upload, enabling direct testing and execution.
 */
export const getUploadRaceMapMutationOptions = (
  queryClient: QueryClient,
  raceId?: string,
) => ({
  mutationFn: (file: File) => {
    if (!raceId || !raceId.trim()) {
      throw new Error('Không tìm thấy mã trận đấu.')
    }
    return uploadRaceMap(raceId, file)
  },
  onSuccess: (data?: UploadRaceMapResponse) => {
    if (raceId?.trim() && data?.mapImageUrl) {
      queryClient.setQueryData(
        buildMapQueryKeys.mapDetail(raceId.trim()),
        (old: RaceMapDetailResponse | undefined) =>
          old
            ? { ...old, mapImageUrl: data.mapImageUrl }
            : { id: raceId.trim(), mapImageUrl: data.mapImageUrl },
      )
    }
    void queryClient.invalidateQueries({
      queryKey: buildMapQueryKeys.all,
    })
    void queryClient.invalidateQueries({
      queryKey: ['races'],
    })
  },
})

/**
 * Mutation hook handling race map image upload and query cache invalidation.
 */
export const useUploadRaceMapMutation = (raceId?: string) => {
  const queryClient = useQueryClient()

  return useMutation(getUploadRaceMapMutationOptions(queryClient, raceId))
}
