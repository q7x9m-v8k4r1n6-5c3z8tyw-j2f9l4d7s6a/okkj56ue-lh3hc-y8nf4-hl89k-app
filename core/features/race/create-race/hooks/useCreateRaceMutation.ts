import { useMutation, useQueryClient } from '@tanstack/react-query'
import { raceQueryKey } from '@/core/features/race/constants'
import type { CreateRaceRequest } from '@/core/features/race/create-race/models'
import { createNewRace } from '../api'

export const useCreateRaceMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (race: CreateRaceRequest) => {
      return createNewRace(race)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: raceQueryKey })
    },
  })
}
