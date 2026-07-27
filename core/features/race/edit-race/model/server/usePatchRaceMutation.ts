import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patchRace } from '../../api/editRace.api'
import {
  editRaceRequestSchema,
  type EditRaceRequest,
} from '../editRace.contract'
import { editRaceQueryKeys } from './editRace.queryKeys'

export type PatchRaceVariables = {
  coverFile: File | null
  payload: EditRaceRequest
}

/**
 * Owns the PATCH request and React Query cache invalidation.
 *
 * Mapping frontend state into an API payload is intentionally handled by the
 * editor view-model before this server-state hook is called.
 */
export const usePatchRaceMutation = (raceId?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ coverFile, payload }: PatchRaceVariables) => {
      if (!raceId) throw new Error('Không tìm thấy mã trận đấu.')
      return patchRace(
        raceId,
        editRaceRequestSchema.parse(payload),
        coverFile,
      )
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: editRaceQueryKeys.all,
      })
    },
  })
}
