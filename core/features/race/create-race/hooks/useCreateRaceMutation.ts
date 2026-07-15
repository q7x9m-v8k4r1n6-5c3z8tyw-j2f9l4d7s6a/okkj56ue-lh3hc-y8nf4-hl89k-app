import { useMutation, useQueryClient } from '@tanstack/react-query'
import { raceQueryKey } from '@/core/features/race/constants'
import type { BackendCreateRaceRequest } from '../helpers/mapToBackendRequest'
import { createNewRace } from '../api'

export const useCreateRaceMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (race: BackendCreateRaceRequest) => {
      return createNewRace(race)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: raceQueryKey })
    },
  })
}
