import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadAndSaveRaceMap } from '../../api/buildMap.api'
import { buildMapQueryKeys } from './buildMap.queryKeys'

export interface SaveMapVariables {
  file: File
}

/**
 * Mutation hook to upload race map image to Azure Blob Storage (container 'race-map')
 * and persist mapImageUrl into the Database.
 */
export const useSaveMapMutation = (raceId?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ file }: SaveMapVariables) => {
      if (!raceId) throw new Error('Không tìm thấy mã trận đấu.')
      return uploadAndSaveRaceMap(raceId, file)
    },
    onSuccess: () => {
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
