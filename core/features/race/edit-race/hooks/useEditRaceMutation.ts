import { useMutation, useQueryClient } from '@tanstack/react-query'
import { raceQueryKey } from '@/core/features/race/constants'
import { editRaceRequestSchema } from '../models'
import { updateRace } from '../api'
import type { EditRaceRequest } from '../models'

type EditRaceMutationVariables = {
  payload: unknown
  raceId: string
}

export const useEditRaceMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ payload, raceId }: EditRaceMutationVariables) => {
      const validatedData = editRaceRequestSchema.parse(payload) as EditRaceRequest

      return updateRace(raceId, validatedData)
    },
    onSuccess: (_updatedRace, { raceId }) => {
      void queryClient.invalidateQueries({ queryKey: raceQueryKey })
      void queryClient.invalidateQueries({ queryKey: [...raceQueryKey, 'detail', raceId] })
    },
  })
}
