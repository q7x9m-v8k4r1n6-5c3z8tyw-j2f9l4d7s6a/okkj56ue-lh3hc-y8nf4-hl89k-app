import { useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { updateRaceMapSettings } from '../../api/buildMap.api'
import type { RaceMapDetailResponse, UpdateRaceMapSettingsPayload } from '../buildMap.contract'
import { buildMapQueryKeys } from './buildMap.queryKeys'

/**
 * Mutation options factory for updating race map settings, enabling direct testing and execution.
 */
export const getUpdateRaceMapSettingsMutationOptions = (
  queryClient: QueryClient,
  raceId?: string,
) => ({
  mutationFn: (payload: UpdateRaceMapSettingsPayload) => {
    if (!raceId || !raceId.trim()) {
      throw new Error('Không tìm thấy mã trận đấu.')
    }
    return updateRaceMapSettings(raceId.trim(), payload)
  },
  onSuccess: (data: RaceMapDetailResponse) => {
    if (raceId?.trim()) {
      queryClient.setQueryData(buildMapQueryKeys.mapDetail(raceId.trim()), data)
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
 * React Query mutation hook managing race map settings update and cache invalidation.
 */
export const useUpdateRaceMapSettingsMutation = (raceId?: string) => {
  const queryClient = useQueryClient()

  return useMutation(getUpdateRaceMapSettingsMutationOptions(queryClient, raceId))
}
