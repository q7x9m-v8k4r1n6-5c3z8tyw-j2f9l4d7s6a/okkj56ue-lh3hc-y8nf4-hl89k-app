import { useMutation, useQueryClient } from '@tanstack/react-query'
import { raceQueryKey } from '@/core/features/race/constants'
import { raceDetailQueryKey } from '@/core/entities/race'
import type { CreateRaceRequest } from '../../create-race/models'
import { createRaceRequestSchema } from '../../create-race/models'
import { updateRace } from '../api'

export const useEditRaceMutation = (raceId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (raceData: CreateRaceRequest) => {
      const validatedData = createRaceRequestSchema.parse(raceData)
      return updateRace(raceId, validatedData)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: raceQueryKey })
      void queryClient.invalidateQueries({ queryKey: raceDetailQueryKey(raceId) })
    },
  })
}
