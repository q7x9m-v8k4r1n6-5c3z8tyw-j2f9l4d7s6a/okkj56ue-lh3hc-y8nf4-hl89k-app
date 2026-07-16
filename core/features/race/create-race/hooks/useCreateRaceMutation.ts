import { useMutation, useQueryClient } from '@tanstack/react-query'
import { raceQueryKey } from '@/core/features/race/constants'
import { createNewRace } from '../api'
import { createRaceRequestSchema } from '../models/createRace.schema'
import type { CreateRaceRequest } from '../models/createRace.type'

export const useCreateRaceMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (raceData: unknown) => {
      const validatedData = createRaceRequestSchema.parse(raceData) as CreateRaceRequest

      return createNewRace(validatedData)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: raceQueryKey })
    },
  })
}